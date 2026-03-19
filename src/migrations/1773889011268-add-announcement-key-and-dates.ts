import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnnouncementKeyAndDates1773889011268 implements MigrationInterface {
    name = 'AddAnnouncementKeyAndDates1773889011268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`announcements\` ADD \`key\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`announcements\` ADD UNIQUE INDEX \`IDX_358408687969fb9fd0a225f1a2\` (\`key\`)`);
        await queryRunner.query(`ALTER TABLE \`announcements\` ADD \`examStartDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`announcements\` ADD \`examEndDate\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`announcements\` ADD \`reapplicationDate\` date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`announcements\` DROP COLUMN \`reapplicationDate\``);
        await queryRunner.query(`ALTER TABLE \`announcements\` DROP COLUMN \`examEndDate\``);
        await queryRunner.query(`ALTER TABLE \`announcements\` DROP COLUMN \`examStartDate\``);
        await queryRunner.query(`ALTER TABLE \`announcements\` DROP INDEX \`IDX_358408687969fb9fd0a225f1a2\``);
        await queryRunner.query(`ALTER TABLE \`announcements\` DROP COLUMN \`key\``);
    }

}
