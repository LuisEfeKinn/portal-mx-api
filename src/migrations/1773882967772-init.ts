import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1773882967772 implements MigrationInterface {
  name = 'Init1773882967772'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`genders\` (\`id\` bigint NOT NULL, \`name\` varchar(50) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`identification_types\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`abbreviation\` varchar(50) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`modules\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(60) NOT NULL, \`description\` varchar(255) NULL, \`icon\` varchar(255) NULL, \`route\` varchar(255) NULL, \`order\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`items\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(60) NOT NULL, \`icon\` varchar(255) NULL, \`route\` varchar(255) NULL, \`moduleId\` bigint NOT NULL, \`itemparentId\` bigint NULL, \`order\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`createdAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`rol_item_permissions\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`roleId\` bigint NOT NULL, \`itemId\` bigint NOT NULL, \`permissionId\` bigint NOT NULL, \`createdAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(255) NULL, \`isSystem\` tinyint NOT NULL DEFAULT 0, \`key\` varchar(50) NULL, \`createdAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_a87cf0659c3ac379b339acf36a\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`user_roles\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`userId\` bigint NOT NULL, \`roleId\` bigint NOT NULL, \`createdAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NULL, \`secondName\` varchar(255) NULL, \`firstLastname\` varchar(255) NULL, \`secondLastname\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`identification\` varchar(50) NULL, \`identificationTypeId\` bigint NULL, \`displayName\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`genderId\` bigint NULL, \`mobile\` varchar(50) NULL, \`homePhone\` varchar(50) NULL, \`birthDate\` date NULL, \`rememberToken\` varchar(255) NULL, \`keyChangePassword\` varchar(255) NULL, \`isPasswordReset\` tinyint NOT NULL DEFAULT 0, \`acceptedTerms\` tinyint NOT NULL DEFAULT 0, \`isProfileCompleted\` tinyint NULL DEFAULT 0, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`announcements\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`milestones\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`key\` varchar(50) NOT NULL, \`description\` text NULL, \`order\` int NOT NULL, \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_993c970c58fcce20c2f8050074\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`resources\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`url\` varchar(500) NOT NULL, \`description\` text NULL, \`announcementId\` bigint NOT NULL, \`milestoneId\` bigint NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`black_list_token\` (\`token\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`token\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`items\` ADD CONSTRAINT \`FK_6f6f0a78433d8ec976f27b08d79\` FOREIGN KEY (\`moduleId\`) REFERENCES \`modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`rol_item_permissions\` ADD CONSTRAINT \`FK_82197728fc694bcd5d4c67196a1\` FOREIGN KEY (\`itemId\`) REFERENCES \`items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`rol_item_permissions\` ADD CONSTRAINT \`FK_8d029b259db1cb84215b8e5c2ba\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`rol_item_permissions\` ADD CONSTRAINT \`FK_1617e37aa2a359761b1d43884e9\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_472b25323af01488f1f66a06b67\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_86033897c009fcca8b6505d6be2\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_1340fee474d41bbab8847df407a\` FOREIGN KEY (\`identificationTypeId\`) REFERENCES \`identification_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_cf6706b7fc5f8847430a1c468d3\` FOREIGN KEY (\`genderId\`) REFERENCES \`genders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`resources\` ADD CONSTRAINT \`FK_0cc94d4fea2b26efdfef438358c\` FOREIGN KEY (\`announcementId\`) REFERENCES \`announcements\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`resources\` ADD CONSTRAINT \`FK_a9bd86651b6a4e30c5e2e9f235c\` FOREIGN KEY (\`milestoneId\`) REFERENCES \`milestones\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`resources\` DROP FOREIGN KEY \`FK_a9bd86651b6a4e30c5e2e9f235c\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`resources\` DROP FOREIGN KEY \`FK_0cc94d4fea2b26efdfef438358c\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_cf6706b7fc5f8847430a1c468d3\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_1340fee474d41bbab8847df407a\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_86033897c009fcca8b6505d6be2\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_472b25323af01488f1f66a06b67\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`rol_item_permissions\` DROP FOREIGN KEY \`FK_1617e37aa2a359761b1d43884e9\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`rol_item_permissions\` DROP FOREIGN KEY \`FK_8d029b259db1cb84215b8e5c2ba\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`rol_item_permissions\` DROP FOREIGN KEY \`FK_82197728fc694bcd5d4c67196a1\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_6f6f0a78433d8ec976f27b08d79\``,
    )
    await queryRunner.query(`DROP TABLE \`black_list_token\``)
    await queryRunner.query(`DROP TABLE \`resources\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_993c970c58fcce20c2f8050074\` ON \`milestones\``,
    )
    await queryRunner.query(`DROP TABLE \`milestones\``)
    await queryRunner.query(`DROP TABLE \`announcements\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    )
    await queryRunner.query(`DROP TABLE \`users\``)
    await queryRunner.query(`DROP TABLE \`user_roles\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_a87cf0659c3ac379b339acf36a\` ON \`roles\``,
    )
    await queryRunner.query(`DROP TABLE \`roles\``)
    await queryRunner.query(`DROP TABLE \`rol_item_permissions\``)
    await queryRunner.query(`DROP TABLE \`permissions\``)
    await queryRunner.query(`DROP TABLE \`items\``)
    await queryRunner.query(`DROP TABLE \`modules\``)
    await queryRunner.query(`DROP TABLE \`identification_types\``)
    await queryRunner.query(`DROP TABLE \`genders\``)
  }
}
