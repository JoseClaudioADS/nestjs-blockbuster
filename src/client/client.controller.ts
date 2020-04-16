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
    Query,
    Delete,
} from '@nestjs/common';
import * as Yup from 'yup';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUpdateClientDTO } from './dto/create-update-client.dto';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { Client } from './client.entity';
import { SearchClientDTO } from './dto/search-client.dto';
import { FindCheckHelper } from '../shared/find-check.helper';

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
        private readonly findCheckHelper: FindCheckHelper,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async index(@Query() searchClientDTO: SearchClientDTO) {
        return this.clientService.findAll(searchClientDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async show(@Param('id') id: string) {
        return this.clientService.show(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseFilters(ValidationExceptionFilter)
    async store(@Body() createClientDTO: CreateUpdateClientDTO) {
        await this.schemaValidation.validate(createClientDTO, {
            abortEarly: false,
        });

        const photo = await this.findCheckHelper.findAndCheckFile(
            createClientDTO.photoId,
            'Photo not found',
        );

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
        const clientDb = await this.findCheckHelper.findAndCheckClient(id);

        await this.schemaValidation.validate(createClientDTO, {
            abortEarly: false,
        });

        const photo = await this.findCheckHelper.findAndCheckFile(
            createClientDTO.photoId,
            'Photo not found',
        );

        Object.assign(clientDb, createClientDTO);
        clientDb.photo = photo;

        return await this.clientService.save(clientDb);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async destroy(@Param('id') id: string) {
        const clientDb = await this.findCheckHelper.findAndCheckClient(id);

        return await this.clientService.delete(clientDb);
    }
}
