if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {run, getDB} from '../mongo/config'
async function bootstrap() {
  await run()
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
