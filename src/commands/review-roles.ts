import { SlashCommandBuilder } from "discord.js";
import { Command } from ".";

const command: Command = {
  data: new SlashCommandBuilder().setName("review-roles").setDescription("역할 생성 요청 관리"),
  func: async (interaction) => {
    console.log(interaction.guild, interaction.channel);
    await interaction.reply("Test");
  }
};

export default command;
