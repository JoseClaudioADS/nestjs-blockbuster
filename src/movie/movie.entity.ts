import { Category } from '../category/category.entity';
import { File } from '../file/file.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ length: 100 })
    title: string;
    @Column({ type: 'text' })
    description: string;
    @Column({ type: 'int' })
    stock: number;

    @ManyToOne(type => Category)
    @JoinColumn()
    category: Category;

    @ManyToOne(type => File)
    @JoinColumn()
    photo: File;

    @CreateDateColumn()
    createdDate: Date;
    @UpdateDateColumn()
    updatedDate: Date;
}
