import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { Repository, DeleteResult } from 'typeorm';
import { SearchClientDTO } from './dto/search-client.dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) {}

    findAll(searchClientDTO: SearchClientDTO): Promise<Client[]> {
        const { name, email } = searchClientDTO;

        const builder = this.clientRepository.createQueryBuilder('client');
        builder.innerJoinAndSelect('client.photo', 'photo');

        if (name) {
            builder.andWhere('LOWER(client.name) LIKE :name', {
                name: `%${name.toLowerCase()}%`,
            });
        }

        if (email) {
            builder.andWhere('client.email = :email', { email });
        }

        return builder.getMany();
    }

    findById(id: string): Promise<Client> {
        return this.clientRepository.findOne(id);
    }

    show(id: string): Promise<Client> {
        return this.clientRepository.findOne(id, {
            relations: ['photo'],
        });
    }

    findByEmail(email: string): Promise<Client> {
        return this.clientRepository.findOne({ where: { email } });
    }

    save(client: Client): Promise<Client> {
        return this.clientRepository.save(client);
    }

    delete(client: Client): Promise<DeleteResult> {
        return this.clientRepository.delete(client.id);
    }
}
