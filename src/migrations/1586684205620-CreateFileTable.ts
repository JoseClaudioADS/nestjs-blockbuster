import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFileTable1586684205620 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'file',
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
                        name: 'description',
                        type: 'varchar',
                    },
                ],
            }),
            true,
            false,
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('file');
    }
}
