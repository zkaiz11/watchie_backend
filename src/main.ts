import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT: number = parseInt(process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://watchie-xl1e.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(PORT || 3000);
}
bootstrap();
