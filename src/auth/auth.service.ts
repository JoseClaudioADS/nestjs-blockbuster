import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async validateUser(login: string, pass: string): Promise<any> {
        const userDb = await this.userService.findByLogin(login);

        if (userDb && (await bcrypt.compare(pass, userDb.password))) {
            const { password, ...result } = userDb;
            return result;
        }

        return null;
    }
}
