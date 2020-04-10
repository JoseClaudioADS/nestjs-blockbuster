import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    findById(id: string): Promise<Category> {
        return this.categoryRepository.findOne(id);
    }

    delete(category: Category): Promise<DeleteResult> {
        return this.categoryRepository.delete(category.id);
    }

    findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    save(category: Category): Promise<Category> {
        return this.categoryRepository.save(category);
    }
}
