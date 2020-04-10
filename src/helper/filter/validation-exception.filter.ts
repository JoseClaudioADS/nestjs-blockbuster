import {
    ExceptionFilter,
    ArgumentsHost,
    HttpStatus,
    Catch,
} from '@nestjs/common';
import { ValidationError } from 'yup';
import { Response, Request } from 'express';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = HttpStatus.BAD_REQUEST;

        response.status(status).json({
            errors: exception.errors,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
