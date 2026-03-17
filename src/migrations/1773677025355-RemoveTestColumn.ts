import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTestColumn1773677025355 implements MigrationInterface {
    name = 'RemoveTestColumn1773677025355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "test_column"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "test_column" character varying`);
    }

}
