import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async store(@Body() createUserDTO: CreateUserDTO) {
        const user = new User();
        Object.assign(user, createUserDTO);

        return await this.userService.save(user);
    }
}
