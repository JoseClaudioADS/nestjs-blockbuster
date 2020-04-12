import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AddFKClientPhoto1586685282759 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            'client',
            new TableColumn({
                name: 'photoId',
                type: 'uuid',
            }),
        );

        await queryRunner.createForeignKey(
            'client',
            new TableForeignKey({
                columnNames: ['photoId'],
                referencedTableName: 'file',
                referencedColumnNames: ['id'],
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('client');
        const foreignKey = table.foreignKeys.find(
            fk => fk.columnNames.indexOf('photoId') !== -1,
        );

        await queryRunner.dropForeignKey('client', foreignKey);
        await queryRunner.dropColumn('client', 'photoId');
    }
}
