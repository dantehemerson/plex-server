import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

console.log('Variables', {
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  YOUTUBE__PLAYLIST_ID: process.env.YOUTUBE__PLAYLIST_ID,
  AUTH__PROVIDERS__GOOGLE__CLIENT_ID:
    process.env.AUTH__PROVIDERS__GOOGLE__CLIENT_ID,
  AUTH__PROVIDERS__GOOGLE__CLIENT_SECRET:
    process.env.AUTH__PROVIDERS__GOOGLE__CLIENT_SECRET,
  AUTH__PROVIDERS__GOOGLE__REFRESH_TOKEN:
    process.env.AUTH__PROVIDERS__GOOGLE__REFRESH_TOKEN,
  MEDIA_FOLDER: process.env.MEDIA_FOLDER,
  PORT: process.env.PORT,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Plex API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000, async () => {
    console.log(`Server is running on: ${await app.getUrl()}`);
  });
}

bootstrap();
