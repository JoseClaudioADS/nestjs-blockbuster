import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMovieTable1586688911902 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'movie',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'text',
                    },
                    {
                        name: 'stock',
                        type: 'int',
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
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('movie');
    }
}
