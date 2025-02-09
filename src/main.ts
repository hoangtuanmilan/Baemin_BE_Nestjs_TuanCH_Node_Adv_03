import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // origin: "*" allow all request urls to access
  app.enableCors({
    // only 2 domains to access 
    origin: ['http://localhost:8080', 'http://localhost:3030'],
  });
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
