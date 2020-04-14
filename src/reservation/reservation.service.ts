import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
    ) {}

    save(reservation: Reservation): Promise<Reservation> {
        return this.reservationRepository.save(reservation);
    }
}
