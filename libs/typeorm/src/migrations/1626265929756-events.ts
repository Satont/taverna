import { MigrationInterface, QueryRunner } from 'typeorm';

export class events1626265929756 implements MigrationInterface {
  name = 'events1626265929756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "active" boolean NOT NULL DEFAULT true, "date" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" character varying NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_participants_channels" ("eventsId" integer NOT NULL, "channelsId" character varying NOT NULL, CONSTRAINT "PK_c17c8ed57a7a39bf9a13ee37899" PRIMARY KEY ("eventsId", "channelsId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_51d81ea772396ad379ba6fdb0a" ON "events_participants_channels" ("eventsId") `);
    await queryRunner.query(`CREATE INDEX "IDX_3634f08215c500601a7b7a7b06" ON "events_participants_channels" ("channelsId") `);
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_96ce126fb3f1b5368f8e3c02989" FOREIGN KEY ("authorId") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_participants_channels" ADD CONSTRAINT "FK_51d81ea772396ad379ba6fdb0ab" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_participants_channels" ADD CONSTRAINT "FK_3634f08215c500601a7b7a7b06c" FOREIGN KEY ("channelsId") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events_participants_channels" DROP CONSTRAINT "FK_3634f08215c500601a7b7a7b06c"`);
    await queryRunner.query(`ALTER TABLE "events_participants_channels" DROP CONSTRAINT "FK_51d81ea772396ad379ba6fdb0ab"`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_96ce126fb3f1b5368f8e3c02989"`);
    await queryRunner.query(`DROP INDEX "IDX_3634f08215c500601a7b7a7b06"`);
    await queryRunner.query(`DROP INDEX "IDX_51d81ea772396ad379ba6fdb0a"`);
    await queryRunner.query(`DROP TABLE "events_participants_channels"`);
    await queryRunner.query(`DROP TABLE "events"`);
  }
}
