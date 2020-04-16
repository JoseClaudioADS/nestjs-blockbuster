import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Reservation } from './reservation.entity';
import { Repository, Brackets } from 'typeorm';
import { SearchReservationDTO } from './dto/search-reservation.dto';
import { BusinessException } from '../helper/exceptions/business-exception';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
    ) {}

    search(searchReservationDTO: SearchReservationDTO) {
        const { clientName, movieTitle, startDate } = searchReservationDTO;

        const page = searchReservationDTO.page || 0;
        const size = searchReservationDTO.size || 10;

        const qb = this.reservationRepository.createQueryBuilder('reservation');
        qb.innerJoinAndSelect('reservation.movies', 'movie');
        qb.innerJoinAndSelect('reservation.client', 'client');

        if (movieTitle) {
            qb.andWhere('movie.title ilike :title', {
                title: `%${movieTitle}%`,
            });
        }

        if (clientName) {
            qb.andWhere('client.name ilike :name', { name: `%${clientName}%` });
        }

        if (startDate) {
            qb.andWhere('reservation.start >= :startDate', { startDate });
        }

        qb.orderBy('client.name');

        qb.skip(page * size);
        qb.take(size);

        return qb.getManyAndCount();
    }

    validateStartEndDates(reservation: Reservation) {
        const { start, end } = reservation;

        const startDay = dayjs(start);
        const endDay = dayjs(end);
        const today = dayjs();

        if (startDay.isBefore(today)) {
            throw new BusinessException('Start date is before today');
        }

        if (endDay.isBefore(today)) {
            throw new BusinessException('End date is before today');
        }

        if (startDay.isAfter(end)) {
            throw new BusinessException('Start date is after end date');
        }
    }

    findMovieReservations(reservation: Reservation) {
        const { start, movies } = reservation;

        const qb = this.reservationRepository.createQueryBuilder('r');

        qb.select('movie.id');
        qb.addSelect(
            'CASE WHEN (count(movie.id) >= movie.stock) THEN 1 ELSE 0 END as nonstock',
        );
        qb.innerJoin('r.movies', 'movie');
        qb.where(
            new Brackets(qb => {
                qb.where('DATE(r.start) <= DATE(:start)', {
                    start,
                }).andWhere('DATE(r.end) >= DATE(:end)', { end: start });
            }),
        );

        qb.andWhere('movie.id IN (:...ids) ', { ids: movies.map(m => m.id) });
        qb.groupBy('movie.id');
        qb.addGroupBy('movie.stock');

        return qb.getRawMany();
    }

    async checkStockMovies(reservation: Reservation) {
        const { movies } = reservation;

        const results = await this.findMovieReservations(reservation);

        if (results && results.length > 0) {
            movies.forEach(movie => {
                const result = results.filter(r => r.movie_id === movie.id)[0];

                if (Boolean(result.nonstock)) {
                    throw new BusinessException(
                        `Movie ${movie.title} has no stock`,
                    );
                }
            });
        }
    }

    async save(reservation: Reservation): Promise<Reservation> {
        this.validateStartEndDates(reservation);
        await this.checkStockMovies(reservation);

        return this.reservationRepository.save(reservation);
    }
}
