import { MigrationInterface, QueryRunner } from 'typeorm';

export class raidViewers1610211023139 implements MigrationInterface {
  name = 'raidViewers1610211023139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "raids"
            ADD "viewers" integer
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "raids" DROP COLUMN "viewers"
        `);
  }
}
