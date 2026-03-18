import { DataSource } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";

config();
const configService = new ConfigService();

export default new DataSource({
  type: "mariadb",
  username: configService.get("DB_USER"),
  password: configService.get("DB_PASSWORD"),
  database: configService.get("DB_DATABASE"),
  port: Number(configService.get("DB_PORT")),
  host: configService.get("DB_HOST"),
  synchronize: false,
  entities: [`${__dirname}/src/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/src/**/migrations/*.{js,ts}`],
});
