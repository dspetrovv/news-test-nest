import { MigrationInterface, QueryRunner } from 'typeorm';

export class asd1690464263211 implements MigrationInterface {
  name = 'asd1690464263211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "news_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "authorId" integer, CONSTRAINT "PK_53158994f55b6639eac4bf8db7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_entity" ADD CONSTRAINT "FK_24eb0cff143ef4387635dae0d2b" FOREIGN KEY ("authorId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news_entity" DROP CONSTRAINT "FK_24eb0cff143ef4387635dae0d2b"`,
    );
    await queryRunner.query(`DROP TABLE "news_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
