import { MigrationInterface, QueryRunner } from 'typeorm'

export class ApplicantProgress1773900000000 implements MigrationInterface {
  name = 'ApplicantProgress1773900000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`applicant_progress\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`userId\` bigint NOT NULL,
        \`announcementId\` bigint NOT NULL,
        \`milestoneId\` bigint NOT NULL,
        \`completedAt\` timestamp NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_applicant_progress\` (\`userId\`, \`announcementId\`, \`milestoneId\`),
        INDEX \`IDX_progress_user_announcement\` (\`userId\`, \`announcementId\`)
      ) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`applicant_progress\` ADD CONSTRAINT \`FK_applicant_progress_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`applicant_progress\` ADD CONSTRAINT \`FK_applicant_progress_announcement\` FOREIGN KEY (\`announcementId\`) REFERENCES \`announcements\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`applicant_progress\` ADD CONSTRAINT \`FK_applicant_progress_milestone\` FOREIGN KEY (\`milestoneId\`) REFERENCES \`milestones\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`applicant_progress\` DROP FOREIGN KEY \`FK_applicant_progress_milestone\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`applicant_progress\` DROP FOREIGN KEY \`FK_applicant_progress_announcement\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`applicant_progress\` DROP FOREIGN KEY \`FK_applicant_progress_user\``,
    )
    await queryRunner.query(`DROP TABLE \`applicant_progress\``)
  }
}
