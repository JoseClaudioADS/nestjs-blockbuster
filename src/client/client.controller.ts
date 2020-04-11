import {
    Controller,
    Post,
    UseGuards,
    Body,
    UseFilters,
    NotFoundException,
    Put,
    Param,
    BadRequestException,
    Get,
} from '@nestjs/common';
import * as Yup from 'yup';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUpdateClientDTO } from './dto/create-update-client.dto';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { Client } from './client.entity';
import { FileService } from '../file/file.service';

@Controller('client')
export class ClientController {
    private readonly schemaValidation = Yup.object().shape({
        name: Yup.string()
            .required()
            .max(200),
        email: Yup.string()
            .required()
            .email()
            .max(200),
        birthday: Yup.date().required(),
        address: Yup.string().required(),
        photoId: Yup.string().required(),
    });

    constructor(
        private readonly clientService: ClientService,
        private readonly fileService: FileService,
    ) {}

    @Get()
    async index() {
        return this.clientService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseFilters(ValidationExceptionFilter)
    async store(@Body() createClientDTO: CreateUpdateClientDTO) {
        await this.schemaValidation.validate(createClientDTO, {
            abortEarly: false,
        });

        await this.checkEmail(createClientDTO);
        const photo = await this.findAndCheckPhoto(createClientDTO.photoId);

        const client = new Client();
        Object.assign(client, createClientDTO);
        client.photo = photo;

        return await this.clientService.save(client);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @UseFilters(ValidationExceptionFilter)
    async update(
        @Param('id') id: string,
        @Body() createClientDTO: CreateUpdateClientDTO,
    ) {
        const clientDb = await this.clientService.findById(id);

        if (!clientDb) {
            throw new NotFoundException();
        }

        await this.schemaValidation.validate(createClientDTO, {
            abortEarly: false,
        });

        await this.checkEmail(createClientDTO, id);
        const photo = await this.findAndCheckPhoto(createClientDTO.photoId);

        Object.assign(clientDb, createClientDTO);
        clientDb.photo = photo;

        return await this.clientService.save(clientDb);
    }

    async findAndCheckPhoto(id: string) {
        const fileDb = await this.fileService.findById(id);

        if (!fileDb) {
            throw new NotFoundException('Photo not found');
        }

        return fileDb;
    }

    async checkEmail(dto: CreateUpdateClientDTO, id?: string) {
        const { email } = dto;

        const client = await this.clientService.findByEmail(email);

        if (client && (!id || id != client.id)) {
            throw new BadRequestException({
                error: 'Email already used by another client',
            });
        }
    }
}
