import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/utils/winston.config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const configService = app.get(ConfigService);

  // Apply Security Headers via Helmet
  app.use(helmet());

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Enable gzip response compression
  app.use(compression());

  // Configure Global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Register Global Interceptor for uniform successful response structure
  app.useGlobalInterceptors(new TransformInterceptor());

  // Register Global Exception Filter for uniform error response structure
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Setup Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('iPhone Mobi Kart API')
    .setDescription('The API documentation for iPhone Mobi Kart E-commerce App')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`Swagger Docs available on: http://localhost:${port}/api/docs`);
}
bootstrap();
