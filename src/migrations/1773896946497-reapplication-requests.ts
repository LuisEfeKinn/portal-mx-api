import { MigrationInterface, QueryRunner } from "typeorm";

export class ReapplicationRequests1773896946497 implements MigrationInterface {
    name = 'ReapplicationRequests1773896946497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reapplication_requests\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`userId\` bigint NOT NULL, \`announcementId\` bigint NOT NULL, \`incidencia\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`documentUrl\` varchar(500) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reapplication_requests\` ADD CONSTRAINT \`FK_64f0889bff85e4ce3fb3a1b2d55\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reapplication_requests\` ADD CONSTRAINT \`FK_3c4526e4f1bf44cc79d341b1656\` FOREIGN KEY (\`announcementId\`) REFERENCES \`announcements\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reapplication_requests\` DROP FOREIGN KEY \`FK_3c4526e4f1bf44cc79d341b1656\``);
        await queryRunner.query(`ALTER TABLE \`reapplication_requests\` DROP FOREIGN KEY \`FK_64f0889bff85e4ce3fb3a1b2d55\``);
        await queryRunner.query(`DROP TABLE \`reapplication_requests\``);
    }

}
