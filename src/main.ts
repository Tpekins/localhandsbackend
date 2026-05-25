import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LoggerService } from './common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const logger = app.get(LoggerService);
    const configService = app.get(ConfigService);

    // Enable CORS
    const corsOrigin = configService.get<string>('server.corsOrigin', '*');
    app.enableCors({
      origin: corsOrigin === '*' ? true : corsOrigin.split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    // Global logging interceptor
    app.useGlobalInterceptors(new LoggingInterceptor(logger));

    // Compression
    app.use(compression());

    // Set global API prefix
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix, {
      exclude: [
        { path: '', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
      ],
    });

    // Swagger documentation setup
    const config = new DocumentBuilder()
      .setTitle('LocalHands API')
      .setDescription('The LocalHands marketplace API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

    const port = configService.get<number>('server.port', 3000);
    await app.listen(port, '0.0.0.0');
    void logger.info(
      'system',
      `Application is running on: http://localhost:${port}`,
    );
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

void bootstrap();
