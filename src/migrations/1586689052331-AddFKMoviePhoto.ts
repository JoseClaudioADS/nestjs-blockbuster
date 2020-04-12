import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AddFKMoviePhoto1586689052331 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            'movie',
            new TableColumn({
                name: 'photoId',
                type: 'uuid',
            }),
        );

        await queryRunner.createForeignKey(
            'movie',
            new TableForeignKey({
                columnNames: ['photoId'],
                referencedTableName: 'file',
                referencedColumnNames: ['id'],
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
                name: 'FK_MOVIE_PHOTO',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('movie', 'FK_MOVIE_PHOTO');
        await queryRunner.dropColumn('movie', 'photoId');
    }
}
