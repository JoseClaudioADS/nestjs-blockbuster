import {
    Controller,
    Post,
    UseGuards,
    Body,
    UseFilters,
    NotFoundException,
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

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseFilters(ValidationExceptionFilter)
    async store(@Body() createClientDTO: CreateUpdateClientDTO) {
        await this.schemaValidation.validate(createClientDTO, {
            abortEarly: false,
        });

        const photo = await this.findAndCheckPhoto(createClientDTO.photoId);

        const client = new Client();
        Object.assign(client, createClientDTO);
        client.photo = photo;

        return await this.clientService.save(client);
    }

    async findAndCheckPhoto(id: string) {
        const fileDb = await this.fileService.findById(id);

        if (!fileDb) {
            throw new NotFoundException('Photo not found');
        }

        return fileDb;
    }
}
