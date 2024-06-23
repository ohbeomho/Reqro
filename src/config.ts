import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, ".env") });

export const nodeEnv = process.env.NODE_ENV;

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
export const dbEnv = { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME };

const { BOT_TOKEN, CLIENT_ID } = process.env;
export const discordEnv = { BOT_TOKEN, CLIENT_ID };

const { TEST_GUILD_ID } = process.env;
export const testEnv = { TEST_GUILD_ID };
