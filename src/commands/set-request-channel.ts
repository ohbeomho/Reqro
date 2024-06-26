import { ChannelType, SlashCommandBuilder } from "discord.js";
import { Command } from ".";
import pool from "../db";
import { RowDataPacket } from "mysql2";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("set-request-channel")
    .setDescription("역할 요청 채널을 변경합니다.")
    .addChannelOption((o) =>
      o.setName("channel").setDescription("새로운 역할 요청 채널").addChannelTypes(ChannelType.GuildText).setRequired(true)
    ),
  func: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.memberPermissions!.has("Administrator")) {
      await interaction.editReply({
        content: "관리자가 아니기 때문에 역할 요청 채널을 변경할 수 없습니다."
      });
      return;
    }

    const conn = pool();
    const newRequestChannel = interaction.options.get("channel", true).value;
    if (
      !Object.values(
        (await conn.execute<RowDataPacket[]>("SELECT EXISTS(SELECT * FROM RequestRole WHERE guildId = ?)", [interaction.guildId]))[0][0]
      )[0]
    )
      await conn.execute("INSERT INTO RequestRole(guildId) VALUES(?)", [interaction.guildId]);

    await conn.execute("UPDATE RequestRole SET requestChannelId = ? WHERE guildId = ?", [newRequestChannel, interaction.guildId]);

    await interaction.editReply({
      content: `역할 요청 채널이 <#${newRequestChannel}>로 변경되었습니다.`
    });
  }
};
