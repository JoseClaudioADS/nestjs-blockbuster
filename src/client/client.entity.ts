import { File } from '../file/file.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity()
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ length: 200 })
    name: string;
    @Column({ length: 200 })
    email: string;
    @Column({ type: 'date' })
    birthday: Date;
    @Column({ type: 'text' })
    address: string;

    @ManyToOne(type => File)
    @JoinColumn()
    photo: File;

    @CreateDateColumn()
    createdDate: Date;
    @UpdateDateColumn()
    updatedDate: Date;
}
