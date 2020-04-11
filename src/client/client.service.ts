import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) {}

    findAll(): Promise<Client[]> {
        return this.clientRepository.find({});
    }

    findById(id: string): Promise<Client> {
        return this.clientRepository.findOne(id);
    }

    findByEmail(email: string): Promise<Client> {
        return this.clientRepository.findOne({ where: { email } });
    }

    save(client: Client): Promise<Client> {
        return this.clientRepository.save(client);
    }
}
