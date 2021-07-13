import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSession1608543117779 implements MigrationInterface {
  name = 'addSession1608543117779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" character varying NOT NULL,
                "expiredAt" bigint NOT NULL,
                "json" text NOT NULL,
                CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_4c1989542e47d9e3b98fe32c67" ON "sessions" ("expiredAt")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "IDX_4c1989542e47d9e3b98fe32c67"
        `);
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
  }
}
