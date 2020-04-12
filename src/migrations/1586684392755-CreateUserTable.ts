import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUserTable1586684392755 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
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
                        name: 'login',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                ],
            }),
            true,
            false,
            false,
        );

        await queryRunner.createIndex(
            'user',
            new TableIndex({
                name: 'IDX_USER_LOGIN',
                columnNames: ['login'],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex('user', 'IDX_USER_LOGIN');
        await queryRunner.dropTable('user');
    }
}
