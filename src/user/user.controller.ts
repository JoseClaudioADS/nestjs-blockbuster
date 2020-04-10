import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UseInterceptors,
    ClassSerializerInterceptor,
    Put,
    Param,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as Yup from 'yup';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

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

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDTO: UpdateUserDTO,
    ) {
        const schemaValidation = Yup.object().shape({
            name: Yup.string().required(),
            login: Yup.string().required(),
        });

        try {
            await schemaValidation.validate(updateUserDTO, {
                abortEarly: false,
            });
        } catch (err) {
            throw new BadRequestException(err);
        }

        const userDb = await this.userService.findById(id);

        if (!userDb) {
            throw new NotFoundException();
        }

        const existsByLoginDiffId = await this.userService.existsByLoginDiffId(
            updateUserDTO.login,
            id,
        );

        if (existsByLoginDiffId) {
            throw new BadRequestException({
                error: 'Login already used by another account',
            });
        }

        Object.assign(userDb, updateUserDTO);
        await this.userService.save(userDb);
    }
}
