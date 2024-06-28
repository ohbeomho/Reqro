import { SlashCommandBuilder } from "discord.js";
import { Command } from ".";
import pool from "../db";
import { RowDataPacket } from "mysql2";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("set-review-channel")
    .setDescription("역할 요청 관리 채널을 변경합니다.")
    .addChannelOption((o) => o.setName("channel").setDescription("새로운 역할 요청 관리 채널").setRequired(true)),
  func: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.memberPermissions!.has("Administrator")) {
      await interaction.editReply({
        content: "관리자가 아니기 때문에 역할 요청 관리 채널을 변경할 수 없습니다."
      });
      return;
    }

    const conn = pool();
    const newReviewChannel = interaction.options.get("channel", true).value;
    if (
      !Object.values(
        (await conn.execute<RowDataPacket[]>("SELECT EXISTS(SELECT * FROM RequestRole WHERE guildId = ?)", [interaction.guildId]))[0][0]
      )[0]
    )
      await conn.execute("INSERT INTO RequestRole(guildId) VALUES(?)", [interaction.guildId]);

    await conn.execute("UPDATE RequestRole SET reviewChannelId = ? WHERE guildId = ?", [newReviewChannel, interaction.guildId]);

    await interaction.editReply({
      content: `역할 요청 관리 채널이 <#${newReviewChannel}>로 변경되었습니다.`
    });
  }
};
