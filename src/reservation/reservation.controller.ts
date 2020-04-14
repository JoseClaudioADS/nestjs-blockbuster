import {
    Controller,
    Post,
    UseGuards,
    UseFilters,
    Body,
    BadRequestException,
} from '@nestjs/common';
import * as Yup from 'yup';
import * as dayjs from 'dayjs';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { Reservation } from './reservation.entity';
import { FindCheckHelper } from '../shared/find-check.helper';
import { Movie } from '../movie/movie.entity';
import { MailService } from '../mail/mail.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService,
        private readonly findCheckHelper: FindCheckHelper,
        @InjectQueue('reservations') private readonly reservationsQueue: Queue,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseFilters(ValidationExceptionFilter)
    async store(@Body() createReservationDTO: CreateReservationDTO) {
        const schemaValidation = Yup.object().shape({
            start: Yup.date().required(),
            end: Yup.date().required(),
            clientId: Yup.string().required(),
            moviesId: Yup.array().required(),
        });

        await schemaValidation.validate(createReservationDTO, {
            abortEarly: false,
        });

        this.validateStartEndDates(createReservationDTO);

        const reservation = new Reservation();
        reservation.start = createReservationDTO.start;
        reservation.end = createReservationDTO.end;
        reservation.client = await this.findCheckHelper.findAndCheckClient(
            createReservationDTO.clientId,
            'Client not found',
        );
        reservation.movies = await this.findAndCheckMovies(
            createReservationDTO.moviesId,
        );

        await this.checkStockMovies(reservation);

        const reservationCreated = await this.reservationService.save(
            reservation,
        );

        this.reservationsQueue.add('new-reservation', reservationCreated);

        return reservationCreated;
    }

    async findAndCheckMovies(ids: Array<string>) {
        const movies = new Array<Movie>();

        for (let i = 0; i < ids.length; i++) {
            movies.push(
                await this.findCheckHelper.findAndCheckMovie(
                    ids[i],
                    'Movie not found',
                ),
            );
        }

        return movies;
    }

    validateStartEndDates(createReservationDTO: CreateReservationDTO) {
        const { start, end } = createReservationDTO;

        const startDay = dayjs(start);
        const endDay = dayjs(end);
        const today = dayjs();

        if (startDay.isBefore(today)) {
            throw new BadRequestException('Start date is before today');
        }

        if (endDay.isBefore(today)) {
            throw new BadRequestException('End date is before today');
        }

        if (startDay.isAfter(end)) {
            throw new BadRequestException('Start date is after end date');
        }
    }

    async checkStockMovies(reservation: Reservation) {
        const { movies } = reservation;

        const results = await this.reservationService.findMovieReservations(
            reservation,
        );

        if (results && results.length > 0) {
            movies.forEach(movie => {
                const result = results.filter(r => r.movie_id === movie.id)[0];

                if (Boolean(result.nonstock)) {
                    throw new BadRequestException(
                        `Movie ${movie.title} has no stock`,
                    );
                }
            });
        }
    }
}
