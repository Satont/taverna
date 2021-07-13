import { MigrationInterface, QueryRunner } from 'typeorm';

export class userMessages1608400131292 implements MigrationInterface {
  name = 'userMessages1608400131292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" character varying NOT NULL,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "users_messages" (
                "id" SERIAL NOT NULL,
                "count" integer NOT NULL DEFAULT '0',
                "userId" character varying,
                "channelId" character varying,
                CONSTRAINT "PK_e57f94cb9db5c38d0e6a314a149" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users_messages"
            ADD CONSTRAINT "FK_87bd04d48fe4b9ae8b6dc4d2bb1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users_messages"
            ADD CONSTRAINT "FK_136d6325b7705620feec34641c5" FOREIGN KEY ("channelId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users_messages" DROP CONSTRAINT "FK_136d6325b7705620feec34641c5"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_messages" DROP CONSTRAINT "FK_87bd04d48fe4b9ae8b6dc4d2bb1"
        `);
    await queryRunner.query(`
            DROP TABLE "users_messages"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
