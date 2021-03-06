import {
    Controller,
    Get,
    UseGuards,
    Body,
    Post,
    UseFilters,
    HttpCode,
    HttpStatus,
    Put,
    Param,
    NotFoundException,
    Delete,
    UseInterceptors,
    CacheInterceptor,
    CacheTTL,
    CacheKey,
    Inject,
    CACHE_MANAGER,
} from '@nestjs/common';
import * as Yup from 'yup';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUpdateCategoryDTO } from './dto/create-update-category.dto';
import { ValidationExceptionFilter } from '../helper/filter/validation-exception.filter';
import { Category } from './category.entity';
import { FindCheckHelper } from '../shared/find-check.helper';

@Controller('category')
export class CategoryController {
    private readonly schemaValidation = Yup.object().shape({
        name: Yup.string().required(),
    });

    constructor(
        private categoryService: CategoryService,
        private findCheckHelper: FindCheckHelper,
        @Inject(CACHE_MANAGER) private cacheManager,
    ) {}

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(20)
    @CacheKey('categorias')
    @UseGuards(JwtAuthGuard)
    @Get()
    async index() {
        return await this.categoryService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseFilters(ValidationExceptionFilter)
    async store(@Body() createCategoryDTO: CreateUpdateCategoryDTO) {
        await this.schemaValidation.validate(createCategoryDTO);

        const category = new Category();
        Object.assign(category, createCategoryDTO);
        this.cacheManager.del('categorias', () => {
            console.log('Cache clear');
        });

        return await this.categoryService.save(category);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @UseFilters(ValidationExceptionFilter)
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDTO: CreateUpdateCategoryDTO,
    ) {
        await this.schemaValidation.validate(updateCategoryDTO);
        const categoryDb = await this.findCheckHelper.findAndCheckCategory(id);
        Object.assign(categoryDb, updateCategoryDTO);

        this.cacheManager.del('categorias', () => {
            console.log('Cache clear');
        });

        await this.categoryService.save(categoryDb);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async destroy(@Param('id') id: string) {
        const categoryDb = await this.findCheckHelper.findAndCheckCategory(id);
        return await this.categoryService.delete(categoryDb);
    }
}
