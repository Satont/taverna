import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1607434481787 implements MigrationInterface {
  name = 'initial1607434481787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "raids" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "fromId" character varying,
                "toId" character varying,
                CONSTRAINT "PK_8127a074d4225c32f9fc6e2f2a5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "channels" (
                "id" character varying NOT NULL,
                "username" character varying NOT NULL,
                CONSTRAINT "PK_bc603823f3f741359c2339389f9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "tokens" (
                "id" SERIAL NOT NULL,
                "accessToken" character varying NOT NULL,
                "refreshToken" character varying NOT NULL,
                "type" character varying NOT NULL,
                CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "raids"
            ADD CONSTRAINT "FK_b3919e21b1326ba5627bc055c9a" FOREIGN KEY ("fromId") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "raids"
            ADD CONSTRAINT "FK_961cfd82e0d99a6ba4b1c9ed6b5" FOREIGN KEY ("toId") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "raids" DROP CONSTRAINT "FK_961cfd82e0d99a6ba4b1c9ed6b5"
        `);
    await queryRunner.query(`
            ALTER TABLE "raids" DROP CONSTRAINT "FK_b3919e21b1326ba5627bc055c9a"
        `);
    await queryRunner.query(`
            DROP TABLE "tokens"
        `);
    await queryRunner.query(`
            DROP TABLE "channels"
        `);
    await queryRunner.query(`
            DROP TABLE "raids"
        `);
  }
}
