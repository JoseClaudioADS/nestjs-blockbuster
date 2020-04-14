import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddFkReservationMoviesMovie1586825661259
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey(
            'reservation_movies_movie',
            new TableForeignKey({
                columnNames: ['reservationId'],
                referencedTableName: 'reservation',
                referencedColumnNames: ['id'],
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
                name: 'FK_RESERVATION_MOVIES',
            }),
        );

        await queryRunner.createForeignKey(
            'reservation_movies_movie',
            new TableForeignKey({
                columnNames: ['movieId'],
                referencedTableName: 'movie',
                referencedColumnNames: ['id'],
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
                name: 'FK_MOVIE_RESERVATION',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey(
            'reservation_movies_movie',
            'FK_MOVIE_RESERVATION',
        );

        await queryRunner.dropForeignKey(
            'reservation_movies_movie',
            'FK_RESERVATION_MOVIES',
        );
    }
}
