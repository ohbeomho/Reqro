import { CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import fs from "fs/promises";
import path from "path";

export type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  func: (interaction: CommandInteraction) => Promise<void>;
};

export async function loadCommands(): Promise<Map<string, Command>> {
  const commands = new Map();

  for (let file of (await fs.readdir(__dirname, { withFileTypes: true })).filter((d) => d.isFile())) {
    if (file.name === "index.ts") continue;

    const command: Command = (await import(path.join(file.parentPath, file.name))).default;
    commands.set(command.data.name, command);
  }

  return commands;
}
