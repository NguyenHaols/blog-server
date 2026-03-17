import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTestColumn1773676750326 implements MigrationInterface {
  name = 'AddTestColumn1773676750326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "test_column" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "test_column"`);
  }
}
