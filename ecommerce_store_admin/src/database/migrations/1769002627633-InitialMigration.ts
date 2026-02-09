import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1769002627633 implements MigrationInterface {
    name = 'InitialMigration1769002627633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`firebaseUid\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`role\` varchar(255) NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`oauth_access_tokens\` (\`id\` varchar(36) NOT NULL, \`tokenId\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`revokedAt\` datetime NULL, \`revoked\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`oauth_access_tokens\` ADD CONSTRAINT \`FK_7234a36d8e49a1fa85095328845\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`oauth_access_tokens\` DROP FOREIGN KEY \`FK_7234a36d8e49a1fa85095328845\``);
        await queryRunner.query(`DROP TABLE \`oauth_access_tokens\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
