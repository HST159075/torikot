import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS: vercel.app ডোমেইন এবং localhost সব allow করা
  app.enableCors({ 
    origin: (origin, callback) => {
      // No origin (mobile apps, curl, etc.) বা vercel.app বা localhost allow
      if (
        !origin || 
        origin.includes('.vercel.app') || 
        origin.includes('localhost') ||
        origin === process.env.FRONTEND_URL
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
