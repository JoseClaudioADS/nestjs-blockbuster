import {
    ExceptionFilter,
    ArgumentsHost,
    HttpStatus,
    Catch,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BusinessException } from '../exceptions/business-exception';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: BusinessException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = HttpStatus.BAD_REQUEST;

        response.status(status).json({
            errors: exception.message,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
