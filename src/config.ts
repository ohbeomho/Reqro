import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, ".env") });

const { BOT_TOKEN, CLIENT_ID, GUILD_ID, NODE_ENV, REQUEST_CHANNEL_ID, REVIEW_CHANNEL_ID } = process.env;
export const envVars = { BOT_TOKEN, CLIENT_ID, GUILD_ID, NODE_ENV, REQUEST_CHANNEL_ID, REVIEW_CHANNEL_ID };

const { TEST_GUILD_ID, TEST_REQUEST_CHANNEL_ID, TEST_REVIEW_CHANNEL_ID } = process.env;
export const testEnvVars = { TEST_GUILD_ID, TEST_REQUEST_CHANNEL_ID, TEST_REVIEW_CHANNEL_ID };
