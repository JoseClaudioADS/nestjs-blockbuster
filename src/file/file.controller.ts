import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Delete,
    Param,
    NotFoundException,
    Get,
    Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { File } from './file.entity';
import { ConfigService } from '@nestjs/config';

@Controller('file')
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly configService: ConfigService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async index() {
        return this.fileService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async store(
        @UploadedFile() uploadFile,
        @Body('description') description: string,
    ) {
        const file = new File();

        file.name = uploadFile.filename;
        file.description = description;

        return await this.fileService.save(file);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async destroy(@Param('id') id: string) {
        const fileDb = await this.fileService.findById(id);

        if (!fileDb) {
            throw new NotFoundException();
        }

        const filePath = path.join(
            __dirname,
            '..',
            '..',
            this.configService.get('MULTER_UPLOAD_PATH'),
            fileDb.name,
        );

        const result = await this.fileService.delete(fileDb);
        fs.unlinkSync(filePath);
        return result;
    }
}
