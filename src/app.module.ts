import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './config/database/database.module';
import { FileModule } from './file/file.module';
import { ClientModule } from './client/client.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.STAGE == 'test' ? '.test.env' : '.env',
        }),
        DatabaseModule,
        UserModule,
        AuthModule,
        CategoryModule,
        FileModule,
        ClientModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
