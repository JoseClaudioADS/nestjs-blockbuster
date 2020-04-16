import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    Put,
    Param,
    NotFoundException,
    UseGuards,
    UseFilters,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as Yup from 'yup';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @UseFilters(ValidationExceptionFilter)
    async store(@Body() createUserDTO: CreateUserDTO) {
        const schemaValidation = Yup.object().shape({
            name: Yup.string().required(),
            login: Yup.string().required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        await schemaValidation.validate(createUserDTO, {
            abortEarly: false,
        });

        const user = new User();
        Object.assign(user, createUserDTO);

        user.password = await bcrypt.hash(createUserDTO.password, 5);

        return await this.userService.save(user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @UseFilters(ValidationExceptionFilter)
    async update(
        @Param('id') id: string,
        @Body() updateUserDTO: UpdateUserDTO,
    ) {
        const schemaValidation = Yup.object().shape({
            name: Yup.string().required(),
            login: Yup.string().required(),
        });

        await schemaValidation.validate(updateUserDTO, {
            abortEarly: false,
        });

        const userDb = await this.userService.findById(id);

        if (!userDb) {
            throw new NotFoundException();
        }

        Object.assign(userDb, updateUserDTO);
        await this.userService.save(userDb);
    }
}
