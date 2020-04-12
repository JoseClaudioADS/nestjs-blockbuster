import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoryTable1586683790945 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'category',
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
                ],
            }),
            true,
            false,
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('category');
    }
}
