import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateClientTable1586684952628 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'client',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'birthday',
                        type: 'date',
                    },
                    {
                        name: 'address',
                        type: 'varchar',
                    },
                    {
                        name: 'createdDate',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedDate',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
            true,
            false,
            false,
        );

        await queryRunner.createIndex(
            'client',
            new TableIndex({
                name: 'IDX_CLIENT_EMAIL',
                columnNames: ['email'],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex('client', 'IDX_CLIENT_EMAIL');
        await queryRunner.dropTable('client');
    }
}
