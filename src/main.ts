import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Ativas Backoffice Api')
    .setDescription('Backoffice API description')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(
    process.env.APP_PORT,
    () => console.log(`App is Running\nDocumentation available on http://localhost:${process.env.APP_PORT}/docs`)
  );
}
bootstrap();
