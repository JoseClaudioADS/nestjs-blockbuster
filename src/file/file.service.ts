import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    findById(id: string): Promise<File> {
        return this.fileRepository.findOne(id);
    }

    save(file: File): Promise<File> {
        return this.fileRepository.save(file);
    }

    delete(file: File): Promise<DeleteResult> {
        return this.fileRepository.delete(file.id);
    }
}
