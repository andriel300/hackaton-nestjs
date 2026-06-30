import {
  BadRequestException,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class AppValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const cleanErrors = errors.map((error) => ({
          property: error.property,
          message: Object.values(error.constraints ?? {}).join('; '),
        }));
        return new BadRequestException(cleanErrors);
      },
    });
  }
}
