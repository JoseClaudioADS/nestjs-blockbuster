import { Injectable, NotFoundException } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { CategoryService } from '../category/category.service';
import { MovieService } from '../movie/movie.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class FindCheckHelper {
    constructor(
        private readonly fileService: FileService,
        private readonly categoryService: CategoryService,
        private readonly movieService: MovieService,
        private readonly clientService: ClientService,
    ) {}

    async findAndCheckCategory(id: string, error?: any) {
        const categoryDb = await this.categoryService.findById(id);
        return this.checkEntity(categoryDb, error);
    }

    async findAndCheckFile(id: string, error?: any) {
        const fileDb = await this.fileService.findById(id);
        return this.checkEntity(fileDb, error);
    }

    async findAndCheckMovie(id: string, error?: any) {
        const movieDb = await this.movieService.findById(id);
        return this.checkEntity(movieDb, error);
    }

    async findAndCheckClient(id: string, error?: any) {
        const clientDb = await this.clientService.findById(id);
        return this.checkEntity(clientDb, error);
    }

    private async checkEntity(entity: any, error?: any) {
        if (!entity) {
            throw new NotFoundException(error);
        }

        return entity;
    }
}
