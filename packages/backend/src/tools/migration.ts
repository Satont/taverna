import { spawn } from 'child_process';
import dotenv from 'dotenv';
import findup from 'find-up';

dotenv.config({ path: findup.sync('.env') });

function bootstrap() {
  return new Promise((res, rej) => {
    const command = spawn('npx', ['typeorm', 'migration:run'], {
      shell: true,
      env: {
        ...process.env,
        TYPEORM_ENTITIES: '../../libs/typeorm/dist/entities/*.js',
        TYPEORM_MIGRATIONS: '../../libs/typeorm/dist/migrations/*.js',
        TYPEORM_ENTITIES_DIR: '../../libs/typeorm/src/entities',
        TYPEORM_MIGRATIONS_DIR: '../../libs/typeorm/src/migrations',
      },
    });

    command.on('error', (e) => {
      throw e;
    });

    command.on('close', () => {
      res(true);
    });
  });
}

bootstrap();
