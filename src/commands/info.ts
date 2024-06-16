import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from ".";

export const command: Command = {
  data: new SlashCommandBuilder().setName("info").setDescription("Reqro 봇의 정보를 표시합니다."),
  func: async (interaction) => {
    const embed = new EmbedBuilder()
      .setTitle("Reqro")
      .setDescription(
        `
개발자: **ohbeomho**
[소스코드](https://github.com/ohbeomho/Reqro)`
      )
      .setThumbnail(interaction.client.user.avatarURL());
    await interaction.reply({ embeds: [embed] });
  }
};
