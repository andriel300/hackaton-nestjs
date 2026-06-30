import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { AppExceptionFilter } from './common/filters/exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));
  app.useGlobalFilters(new AppExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
