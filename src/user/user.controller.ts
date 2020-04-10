import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as Yup from 'yup';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    async store(@Body() createUserDTO: CreateUserDTO) {
        const schemaValidation = Yup.object().shape({
            name: Yup.string().required(),
            login: Yup.string().required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        try {
            await schemaValidation.validate(createUserDTO, {
                abortEarly: false,
            });
        } catch (err) {
            throw new BadRequestException(err);
        }

        const userDb = await this.userService.findByLogin(createUserDTO.login);

        if (userDb) {
            throw new BadRequestException({ error: 'Login already used' });
        }

        const user = new User();
        Object.assign(user, createUserDTO);

        user.password = await bcrypt.hash(createUserDTO.password, 5);

        return await this.userService.save(user);
    }
}
