import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    findByLogin(login: string): Promise<User> {
        return this.userRepository.findOne({ where: { login } });
    }

    save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}
