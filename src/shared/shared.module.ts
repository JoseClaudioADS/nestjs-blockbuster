import { Module, Global } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { CategoryModule } from '../category/category.module';
import { FindCheckHelper } from './find-check.helper';
import { MovieModule } from '../movie/movie.module';

@Global()
@Module({
    imports: [FileModule, CategoryModule, MovieModule],
    providers: [FindCheckHelper],
    exports: [FindCheckHelper],
})
export class SharedModule {}
