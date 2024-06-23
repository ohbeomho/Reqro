import { RowDataPacket, createPool } from "mysql2/promise";
import { dbEnv } from "../config";

const { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASSWORD } = dbEnv;

export default () =>
  createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: Number(DB_PORT),
  });

export interface RequestRole extends RowDataPacket {
  guildId: string;
  requestChannelId: string;
  reviewChannelId: string;
}
