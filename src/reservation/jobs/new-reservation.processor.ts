import { Processor, Process } from '@nestjs/bull';
import { MailService } from '../../mail/mail.service';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('reservations')
export class NewReservationProcessor {
    private readonly logger = new Logger(NewReservationProcessor.name);

    constructor(private readonly mailService: MailService) {}

    @Process('new-reservation')
    handleNewReservation(job: Job) {
        this.logger.log('new-reservation process started');

        const reservationCreated = job.data;

        this.mailService.sendMail({
            from: 'oi@blockbuster.com',
            to: reservationCreated.client.email,
            subject: 'Confirmação da reserva',
            html: `Oi <b>${reservationCreated.client.name}</b>, sua reserva para o dia <i>${reservationCreated.start}</i> foi confirmada.`,
        });
    }
}
