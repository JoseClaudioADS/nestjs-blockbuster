import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}
