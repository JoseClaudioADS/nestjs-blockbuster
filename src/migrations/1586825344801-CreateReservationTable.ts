import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReservationTable1586825344801 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'reservation',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: 'start',
                        type: 'timestamp',
                    },
                    {
                        name: 'end',
                        type: 'timestamp',
                    },
                    {
                        name: 'createdDate',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
            true,
            false,
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('reservation');
    }
}
