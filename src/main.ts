import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from '@jozefazz/nestjs-redoc';

import { AppModule } from './app.module';
import { version } from '../package.json';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.ENABLE_SWAGGER !== '0') {
    const config = new DocumentBuilder()
      .setTitle('Specify your title here')
      .setDescription('Specify your description here..')
      .setVersion(version)
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const redocOptions: RedocOptions = {
      title: 'Specify your title here',
    };

    await SwaggerModule.setup('docs', app, document);
    await RedocModule.setup('redoc', app, document, redocOptions);
  }

  if (process.env.GLOBAL_CORS === '1') {
    app.enableCors();
  } else {
    app.enableCors({
      origin: [
        // Specify your domains here
      ],
      credentials: true,
    });
  }

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
