import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { FileModule } from '../file/file.module';

@Module({
    imports: [TypeOrmModule.forFeature([Client]), FileModule],
    controllers: [ClientController],
    providers: [ClientService],
})
export class ClientModule {}
