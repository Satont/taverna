import dotenv from 'dotenv';
import findup from 'find-up';
import { typeorm, createConnection } from '@taverna/typeorm'

dotenv.config({ path: findup.sync('.env') });

async function bootstrap() {
  try {
    const connection = await createConnection({
      migrations: ['../../libs/typeorm/dist/src/migrations/*.js'],
    })

    await connection.runMigrations()
    console.info('✔ Migration successful.')
  } catch (error) {
    console.error('🔴 Migration failed.')
    console.error(error)
    process.exit(1)
  }

}

bootstrap();
