import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixTableReference1608401425733 implements MigrationInterface {
  name = 'fixTableReference1608401425733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users_messages" DROP CONSTRAINT "FK_136d6325b7705620feec34641c5"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_messages"
            ADD CONSTRAINT "FK_136d6325b7705620feec34641c5" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users_messages" DROP CONSTRAINT "FK_136d6325b7705620feec34641c5"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_messages"
            ADD CONSTRAINT "FK_136d6325b7705620feec34641c5" FOREIGN KEY ("channelId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
