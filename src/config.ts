import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, ".env") });

const { BOT_TOKEN, CLIENT_ID, NODE_ENV } = process.env;
export const envVars = { BOT_TOKEN, CLIENT_ID, NODE_ENV };

const { TEST_GUILD_ID } = process.env;
export const testEnvVars = { TEST_GUILD_ID };
