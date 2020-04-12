import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AddFKMovieCategory1586689061137 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            'movie',
            new TableColumn({
                name: 'categoryId',
                type: 'uuid',
            }),
        );

        await queryRunner.createForeignKey(
            'movie',
            new TableForeignKey({
                columnNames: ['categoryId'],
                referencedTableName: 'category',
                referencedColumnNames: ['id'],
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
                name: 'FK_MOVIE_CATEGORY',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('movie', 'FK_MOVIE_CATEGORY');
        await queryRunner.dropColumn('movie', 'categoryId');
    }
}
