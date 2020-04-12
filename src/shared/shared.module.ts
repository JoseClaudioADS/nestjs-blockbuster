import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { CategoryModule } from '../category/category.module';
import { FindCheckHelper } from './find-check.helper';

@Module({
    imports: [FileModule, CategoryModule],
    providers: [FindCheckHelper],
    exports: [FindCheckHelper],
})
export class SharedModule {}
