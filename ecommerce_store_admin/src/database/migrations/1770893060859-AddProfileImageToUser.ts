import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileImageToUser1770893060859 implements MigrationInterface {
    name = 'AddProfileImageToUser1770893060859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`profile_image\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profile_image\``);
    }

}
