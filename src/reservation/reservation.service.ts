import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { Repository, Brackets } from 'typeorm';
import { SearchReservationDTO } from './dto/search-reservation.dto';

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

    save(reservation: Reservation): Promise<Reservation> {
        return this.reservationRepository.save(reservation);
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
}
