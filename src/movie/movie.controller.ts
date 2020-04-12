import {
    Controller,
    Post,
    UseGuards,
    UseFilters,
    Body,
    NotFoundException,
} from '@nestjs/common';
import * as Yup from 'yup';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { CreateUpdateMovieDTO } from './dto/create-update-movie.dto';
import { CategoryService } from '../category/category.service';
import { FileService } from '../file/file.service';
import { Movie } from './movie.entity';

@Controller('movie')
export class MovieController {
    private readonly schemaValidation = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        stock: Yup.number().required(),
        photoId: Yup.string().required(),
        categoryId: Yup.string().required(),
    });

    constructor(
        private readonly movieService: MovieService,
        private readonly categoryService: CategoryService,
        private readonly fileService: FileService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseFilters(ValidationExceptionFilter)
    async store(@Body() createMovieDTO: CreateUpdateMovieDTO) {
        await this.schemaValidation.validate(createMovieDTO, {
            abortEarly: false,
        });

        const photo = await this.findAndCheckPhoto(createMovieDTO.photoId);
        const category = await this.findAndCheckCategory(
            createMovieDTO.categoryId,
        );

        const movie = new Movie();
        Object.assign(movie, createMovieDTO);
        movie.photo = photo;
        movie.category = category;

        return await this.movieService.save(movie);
    }

    async findAndCheckCategory(id: string) {
        const categoryDb = await this.categoryService.findById(id);

        if (!categoryDb) {
            throw new NotFoundException('Category not found');
        }

        return categoryDb;
    }

    async findAndCheckPhoto(id: string) {
        const fileDb = await this.fileService.findById(id);

        if (!fileDb) {
            throw new NotFoundException('Photo not found');
        }

        return fileDb;
    }
}
