import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticlesTable1759077580090 implements MigrationInterface {
    name = 'CreateArticlesTable1759077580090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" text, "status" character varying NOT NULL DEFAULT 'Draft', "published_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, CONSTRAINT "CHK_ae4f70ab2fe10cf1677a0567e5" CHECK (status != 'Published' OR description IS NOT NULL), CONSTRAINT "CHK_cb1d46e1834ad0a13c440604ef" CHECK ((status = 'Draft' AND "published_at" IS NULL) OR 
        (status = 'Published' AND "published_at" IS NOT NULL)), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "CHK_fc505d7a05d277ee11f799cf06" CHECK ((status = 'Draft' AND "published_at" IS NULL) OR 
        (status = 'Published' AND "published_at" IS NOT NULL))`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_87bb15395540ae06337a486a77a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_87bb15395540ae06337a486a77a"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "CHK_fc505d7a05d277ee11f799cf06"`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
