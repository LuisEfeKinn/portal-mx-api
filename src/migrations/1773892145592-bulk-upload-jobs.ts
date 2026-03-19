import { MigrationInterface, QueryRunner } from 'typeorm'

export class BulkUploadJobs1773892145592 implements MigrationInterface {
  name = 'BulkUploadJobs1773892145592'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bulk_upload_jobs\` (\`id\` uuid NOT NULL, \`status\` varchar(50) NOT NULL DEFAULT 'pending', \`fileName\` varchar(255) NOT NULL, \`fileUrl\` varchar(1000) NOT NULL, \`total\` int NOT NULL DEFAULT '0', \`insertados\` int NOT NULL DEFAULT '0', \`omitidos\` int NOT NULL DEFAULT '0', \`erroresCount\` int NOT NULL DEFAULT '0', \`reportUrl\` varchar(1000) NULL, \`errorMessage\` text NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`completedAt\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`bulk_upload_jobs\``)
  }
}
