import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncEntities1774968963561 implements MigrationInterface {
    name = 'SyncEntities1774968963561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Add the column as nullable
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying`);
        
        // Step 2: Populate existing rows with email or a placeholder
        await queryRunner.query(`UPDATE "users" SET "username" = email`);
        
        // Step 3: Set the column to NOT NULL
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
