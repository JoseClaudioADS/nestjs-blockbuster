import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [TypeOrmModule.forFeature([Movie]), SharedModule],
    controllers: [MovieController],
    providers: [MovieService],
})
export class MovieModule {}
