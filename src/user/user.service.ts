import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '../helper/exceptions/business-exception';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    findByLogin(login: string): Promise<User> {
        return this.userRepository.findOne({ where: { login } });
    }

    findById(id: string): Promise<User | undefined> {
        return this.userRepository.findOne(id);
    }

    async save(user: User): Promise<User> {
        const userDb = await this.findByLogin(user.login);

        if (userDb && (!user.id || user.id != userDb.id)) {
            throw new BusinessException(
                'Login already used by another account',
            );
        }

        return this.userRepository.save(user);
    }
}
