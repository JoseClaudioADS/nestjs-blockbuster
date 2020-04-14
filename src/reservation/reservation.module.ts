import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { MailModule } from '../mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NewReservationProcessor } from './jobs/new-reservation.processor';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reservation]),
        MailModule,
        BullModule.registerQueueAsync({
            name: 'reservations',
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    redis: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [ReservationController],
    providers: [ReservationService, NewReservationProcessor],
})
export class ReservationModule {}
