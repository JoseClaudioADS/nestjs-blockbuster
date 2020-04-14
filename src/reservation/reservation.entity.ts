import { Movie } from '../movie/movie.entity';
import { Client } from '../client/client.entity';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    start: Date;
    @Column()
    end: Date;

    @ManyToMany(type => Movie)
    @JoinTable()
    movies: Movie[];

    @ManyToOne(type => Client)
    @JoinColumn()
    client: Client;

    @CreateDateColumn()
    createdDate: Date;
}
