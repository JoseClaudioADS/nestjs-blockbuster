export class CreateReservationDTO {
    start: Date;
    end: Date;
    clientId: string;
    moviesId: Array<string>;
}
