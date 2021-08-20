/* eslint-disable @typescript-eslint/no-var-requires */
import dotenv from 'dotenv';
import find from 'find-up';

dotenv.config({ path: find.sync('.env') });
import { createConnection, typeorm } from '@taverna/typeorm'
import 'reflect-metadata';
import 'source-map-support/register';
import './helpers/dayjs';

async function bootstrap() {
  await createConnection()
  if (!typeorm.getConnection().isConnected) {
    return setTimeout(() => bootstrap(), 100);
  }

  import('./twitch');
  (await import('./web')).bootstrap();
}

bootstrap();

process.on('unhandledRejection', (reason, promise) => console.error(reason, promise));
process.on('uncaughtException', (reason) => console.error(reason));
