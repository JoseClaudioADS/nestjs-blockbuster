import {
    Controller,
    Post,
    UseGuards,
    UseFilters,
    Body,
    Get,
    Query,
} from '@nestjs/common';
import * as Yup from 'yup';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { Reservation } from './reservation.entity';
import { FindCheckHelper } from '../shared/find-check.helper';
import { Movie } from '../movie/movie.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SearchReservationDTO } from './dto/search-reservation.dto';
import { ReservationsEventsGateway } from './events/reservations-events.gateway';

@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService,
        private readonly findCheckHelper: FindCheckHelper,
        @InjectQueue('reservations') private readonly reservationsQueue: Queue,
        private readonly reservationsEventsGateway: ReservationsEventsGateway,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async index(@Query() searchReservationDTO: SearchReservationDTO) {
        return await this.reservationService.search(searchReservationDTO);
    }

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

        const reservationCreated = await this.reservationService.save(
            reservation,
        );

        this.reservationsEventsGateway.server.emit(
            `new-reservation-${reservationCreated.client.email}`,
            reservationCreated,
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
}
