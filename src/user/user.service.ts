import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository, Not } from 'typeorm';
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

    findById(id: string): Promise<User | undefined> {
        return this.userRepository.findOne(id);
    }

    async existsByLoginDiffId(login: string, id: string): Promise<boolean> {
        const count = await this.userRepository.count({
            where: {
                login,
                id: Not(id),
            },
        });

        return count > 0;
    }

    save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}
