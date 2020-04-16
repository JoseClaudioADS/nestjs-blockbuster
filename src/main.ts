import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { init } from '@sentry/node';
import { ConfigService } from '@nestjs/config';
import { SentryInterceptor } from './helper/interceptor/sentry.interceptor';
import { BusinessExceptionFilter } from './helper/filter/business-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.resolve(ConfigService);
    init({ dsn: (await configService).get('SENTRY_DNS') });

    app.useGlobalFilters(new BusinessExceptionFilter());
    app.useGlobalInterceptors(new SentryInterceptor());

    await app.listen(4000);
}
bootstrap();
