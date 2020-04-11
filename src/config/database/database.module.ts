import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: Number(configService.get('DB_PORT')),
                username: configService.get('DB_USER'),
                password: configService.get('DB_PASS'),
                database: configService.get('DB_DATABASE'),
                autoLoadEntities: true,
                synchronize: true,
                logging: Boolean(Number(configService.get('DB_LOGGING'))),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [],
})
export class DatabaseModule {}
