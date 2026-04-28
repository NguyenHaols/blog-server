import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUuidSchema1777000000000 implements MigrationInterface {
  name = 'InitUuidSchema1777000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "post_tags" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "posts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tags" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."posts_status_enum" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum" CASCADE`);

    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER', 'AUTHOR')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."posts_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "auth0_id" character varying,
        "username" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'AUTHOR',
        "avatar_url" character varying,
        CONSTRAINT "UQ_users_auth0_id" UNIQUE ("auth0_id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "description" character varying,
        CONSTRAINT "UQ_categories_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tags" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        CONSTRAINT "UQ_tags_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_tags_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "title" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "summary" character varying,
        "content" text NOT NULL,
        "thumbnail_url" character varying,
        "status" "public"."posts_status_enum" NOT NULL DEFAULT 'DRAFT',
        "view_count" integer NOT NULL DEFAULT '0',
        "author_id" uuid NOT NULL,
        "category_id" uuid,
        "published_at" TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_posts_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_posts_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "post_tags" (
        "post_id" uuid NOT NULL,
        "tag_id" uuid NOT NULL,
        CONSTRAINT "PK_post_tags" PRIMARY KEY ("post_id", "tag_id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_post_tags_post_id" ON "post_tags" ("post_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_post_tags_tag_id" ON "post_tags" ("tag_id")`,
    );

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "FK_posts_author_id"
      FOREIGN KEY ("author_id") REFERENCES "users"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "FK_posts_category_id"
      FOREIGN KEY ("category_id") REFERENCES "categories"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "post_tags"
      ADD CONSTRAINT "FK_post_tags_post_id"
      FOREIGN KEY ("post_id") REFERENCES "posts"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "post_tags"
      ADD CONSTRAINT "FK_post_tags_tag_id"
      FOREIGN KEY ("tag_id") REFERENCES "tags"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_tags" DROP CONSTRAINT "FK_post_tags_tag_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_tags" DROP CONSTRAINT "FK_post_tags_post_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_posts_category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_posts_author_id"`,
    );

    await queryRunner.query(`DROP INDEX "public"."IDX_post_tags_tag_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_post_tags_post_id"`);

    await queryRunner.query(`DROP TABLE "post_tags"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);

    await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
