import { Injectable, NotFoundException } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class FindCheckHelper {
    constructor(
        private readonly fileService: FileService,
        private readonly categoryService: CategoryService,
    ) {}

    async findAndCheckCategory(id: string, error?: any) {
        const categoryDb = await this.categoryService.findById(id);

        if (!categoryDb) {
            throw new NotFoundException(error);
        }

        return categoryDb;
    }

    async findAndCheckFile(id: string, error?: any) {
        const fileDb = await this.fileService.findById(id);

        if (!fileDb) {
            throw new NotFoundException(error);
        }

        return fileDb;
    }
}
