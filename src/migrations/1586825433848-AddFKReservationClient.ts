import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AddFKReservationClient1586825433848 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            'reservation',
            new TableColumn({
                name: 'clientId',
                type: 'uuid',
            }),
        );

        await queryRunner.createForeignKey(
            'reservation',
            new TableForeignKey({
                columnNames: ['clientId'],
                referencedTableName: 'client',
                referencedColumnNames: ['id'],
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
                name: 'FK_RESERVATION_CLIENT',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey(
            'reservation',
            'FK_RESERVATION_CLIENT',
        );
        await queryRunner.dropColumn('reservation', 'clientId');
    }
}
