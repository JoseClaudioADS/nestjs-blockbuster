import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReservationMoviesMovieTable1586825531033
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'reservation_movies_movie',
                columns: [
                    {
                        name: 'reservationId',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'movieId',
                        type: 'uuid',
                        isPrimary: true,
                    },
                ],
            }),
            true,
            false,
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('reservation_movies_movie');
    }
}
