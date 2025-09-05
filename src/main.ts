import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParseJsonAndBooleanPipe } from './common/pipes/parse-json-fields.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ParseJsonAndBooleanPipe(
      ['amenity'], // JSON fields
      ['show_email', 'show_phone', 'is_published'], // Boolean fields
    ),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000', // local frontend
      'https://just-pd-frontend-testing.vercel.app', // production frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
