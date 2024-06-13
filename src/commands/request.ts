import { SlashCommandBuilder } from "discord.js";
import { Command } from ".";

const command: Command = {
  data: new SlashCommandBuilder().setName("request").setDescription("역할 생성을 요청합니다."),
  func: async (interaction) => {
    console.log(interaction.guild, interaction.channel);
    await interaction.reply("Test");
  }
};

export default command;
