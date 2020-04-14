import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository, DeleteResult } from 'typeorm';
import { SearchMovieDTO } from './dto/search-movie.dto';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) {}

    search(searchMovieDTO: SearchMovieDTO) {
        const { title, category, page, size } = searchMovieDTO;

        const qb = this.movieRepository.createQueryBuilder('movie');
        qb.innerJoinAndSelect('movie.photo', 'photo');
        qb.innerJoinAndSelect('movie.category', 'category');

        if (title) {
            qb.andWhere('movie.title ilike :title', {
                title: `%${title}%`,
            });
        }

        if (category) {
            qb.andWhere('category.name ilike :categoryName', {
                categoryName: `%${category}%`,
            });
        }

        qb.orderBy('movie.title');

        if (page && size) {
            qb.skip(page * size);
            qb.take(size);
        }

        return qb.getManyAndCount();
    }

    save(movie: Movie): Promise<Movie> {
        return this.movieRepository.save(movie);
    }

    findById(id: string): Promise<Movie> {
        return this.movieRepository.findOne(id);
    }

    delete(movie: Movie): Promise<DeleteResult> {
        return this.movieRepository.delete(movie.id);
    }
}
