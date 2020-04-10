import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    @Post()
    store(@Body() createUserDTO: CreateUserDTO) {
        console.log(createUserDTO);
        return 'OK';
    }
}
