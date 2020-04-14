import { Controller, Post, UseGuards, UseFilters, Body } from '@nestjs/common';
import * as Yup from 'yup';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { Reservation } from './reservation.entity';
import { FindCheckHelper } from '../shared/find-check.helper';
import { Movie } from '../movie/movie.entity';

@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService,
        private readonly findCheckHelper: FindCheckHelper,
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

        return await this.reservationService.save(reservation);
    }

    async findAndCheckMovies(ids: Array<string>) {
        const movies = new Array<Movie>();

        for (let i = 0; i < ids.length; i++) {
            movies.push(await this.findCheckHelper.findAndCheckMovie(ids[i]));
        }

        return movies;
    }
}
