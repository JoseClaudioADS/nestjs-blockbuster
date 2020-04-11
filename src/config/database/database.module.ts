import { Module } from '@nestjs/common';
import * as ormConfig from './orm-config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forRoot(ormConfig)],
    controllers: [],
    providers: [],
})
export class DatabaseModule {}
