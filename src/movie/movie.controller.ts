import {
    Controller,
    Post,
    UseGuards,
    UseFilters,
    Body,
    NotFoundException,
    Get,
    Query,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import * as Yup from 'yup';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { CreateUpdateMovieDTO } from './dto/create-update-movie.dto';
import { Movie } from './movie.entity';
import { FindCheckHelper } from '../shared/find-check.helper';
import { SearchMovieDTO } from './dto/search-movie.dto';

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
        private readonly findCheckHelper: FindCheckHelper,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async index(@Query() searchMovieDTO: SearchMovieDTO) {
        const result = await this.movieService.search(searchMovieDTO);

        const [values, count] = result;

        return { content: values, count };
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseFilters(ValidationExceptionFilter)
    async store(@Body() createMovieDTO: CreateUpdateMovieDTO) {
        await this.schemaValidation.validate(createMovieDTO, {
            abortEarly: false,
        });

        const photo = await this.findCheckHelper.findAndCheckFile(
            createMovieDTO.photoId,
            'Photo not found',
        );
        const category = await this.findCheckHelper.findAndCheckCategory(
            createMovieDTO.categoryId,
            'Category not found',
        );

        const movie = new Movie();
        Object.assign(movie, createMovieDTO);
        movie.photo = photo;
        movie.category = category;

        return await this.movieService.save(movie);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @UseFilters(ValidationExceptionFilter)
    async update(
        @Param('id') id: string,
        @Body() createMovieDTO: CreateUpdateMovieDTO,
    ) {
        const movieDb = await this.findCheckHelper.findAndCheckMovie(id);

        await this.schemaValidation.validate(createMovieDTO, {
            abortEarly: false,
        });

        const photo = await this.findCheckHelper.findAndCheckFile(
            createMovieDTO.photoId,
            'Photo not found',
        );
        const category = await this.findCheckHelper.findAndCheckCategory(
            createMovieDTO.categoryId,
            'Category not found',
        );

        Object.assign(movieDb, createMovieDTO);
        movieDb.photo = photo;
        movieDb.category = category;

        return await this.movieService.save(movieDb);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async destroy(@Param('id') id: string) {
        const movieDb = await this.findCheckHelper.findAndCheckMovie(id);

        return await this.movieService.delete(movieDb);
    }
}
