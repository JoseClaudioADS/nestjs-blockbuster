import {
    NestInterceptor,
    Injectable,
    ExecutionContext,
    CallHandler,
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { captureException } from '@sentry/node';
import { BusinessException } from '../exceptions/business-exception';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap(null, exception => {
                if (
                    !(
                        exception instanceof BusinessException ||
                        exception instanceof BadRequestException ||
                        exception instanceof UnauthorizedException ||
                        exception instanceof NotFoundException
                    )
                ) {
                    captureException(exception);
                }
            }),
        );
    }
}
