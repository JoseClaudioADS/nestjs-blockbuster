import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation])],
    controllers: [ReservationController],
    providers: [ReservationService],
})
export class ReservationModule {}
