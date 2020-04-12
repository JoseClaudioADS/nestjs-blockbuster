import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [TypeOrmModule.forFeature([Client]), SharedModule],
    controllers: [ClientController],
    providers: [ClientService],
})
export class ClientModule {}
