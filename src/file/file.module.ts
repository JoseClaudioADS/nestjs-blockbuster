import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                storage: diskStorage({
                    destination: configService.get('MULTER_UPLOAD_PATH'),
                    filename: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() =>
                                Math.round(Math.random() * 16).toString(16),
                            )
                            .join('');

                        cb(null, `${randomName}${extname(file.originalname)}`);
                    },
                }),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [FileService],
    controllers: [FileController],
})
export class FileModule {}
