import {  BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ApiValidationPipe extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                try {
                    return new BadRequestException({
                        message: validationErrors[0]?.constraints ? validationErrors[0].constraints[Object.keys(validationErrors[0].constraints)[0]] : "Validation error",
                        statusCode: HttpStatus.BAD_REQUEST,
                        error: 'Bad Request'
                    });
                } catch (error) {
                    return new BadRequestException({
                        message: error.message,
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Something went wrong!'
                    })
                }
            },
        });
    }
}
