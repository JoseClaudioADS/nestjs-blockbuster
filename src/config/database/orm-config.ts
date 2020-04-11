import * as dotenv from 'dotenv';
dotenv.config();
import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsRun: false,
    logging: Boolean(Number(process.env.DB_LOGGING)),
    migrationsTableName: 'migrations',

    migrations: [__dirname + '/../../migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};

export = config;
