import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { FileModule } from '../file/file.module';
import { CategoryModule } from '../category/category.module';

@Module({
    imports: [TypeOrmModule.forFeature([Movie]), FileModule, CategoryModule],
    controllers: [MovieController],
    providers: [MovieService],
})
export class MovieModule {}
