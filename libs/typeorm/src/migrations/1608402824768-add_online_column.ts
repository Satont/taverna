import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOnlineColumn1608402824768 implements MigrationInterface {
  name = 'addOnlineColumn1608402824768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "channels"
            ADD "online" boolean NOT NULL DEFAULT false
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "channels" DROP COLUMN "online"
        `);
  }
}
