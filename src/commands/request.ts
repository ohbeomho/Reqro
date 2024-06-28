import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  TextChannel,
  resolveColor
} from "discord.js";
import { Command } from ".";
import pool, { RequestRole } from "../db";
import { FieldPacket } from "mysql2";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("request")
    .setDescription("역할 생성을 요청합니다.")
    .addStringOption((o) => o.setName("name").setDescription("역할의 이름").setRequired(true))
    .addStringOption((o) => o.setName("color").setDescription("역할의 색상 (HEX Color)").setRequired(true)),
  func: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const conn = pool();
    const [rows]: [RequestRole[], FieldPacket[]] = await conn.query<RequestRole[]>("SELECT * FROM RequestRole WHERE guildId = ?", [
      interaction.guildId
    ]);

    if (!rows[0] || !rows[0].requestChannelId || !rows[0].reviewChannelId) {
      await interaction.editReply({
        content: "역할 요청 채널, 역할 요청 관리 채널이 설정되어있지 않아\n역할 요청을 할 수 없습니다."
      });
      return;
    }

    if (interaction.channelId !== rows[0].requestChannelId) {
      await interaction.editReply({
        content: "역할 요청 채널이 아닙니다."
      });
      return;
    }

    let roleName = String(interaction.options.get("name", true).value),
      color: any = String(interaction.options.get("color", true).value);

    if (color.startsWith("#")) color = color.substring(1);
    color = parseInt(color, 16);

    const embed = new EmbedBuilder()
      .setTitle(interaction.user.tag + "의 역할 요청")
      .setDescription(`역할 이름: **${roleName}**\n역할 색상: **${color.toString(16)}**`)
      .setColor(color);
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("accept").setLabel("수락").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("reject").setLabel("거절").setStyle(ButtonStyle.Danger)
    );
    const reviewChannel = interaction.client.channels.cache.get(rows[0].reviewChannelId) as TextChannel;
    const message = await reviewChannel.send({
      embeds: [embed],
      components: [actionRow]
    });
    await interaction.editReply({
      content: "역할 요청이 생성되었습니다."
    });

    const deleteMessage = () => reviewChannel.messages.delete(message);

    try {
      // 6시간 후 자동으로 요청 삭제
      const response = await message.awaitMessageComponent({
        filter: (i) => i.member.permissions.has("Administrator"),
        time: 3600_000 * 6
      });

      if (response.customId === "accept") {
        const role = await interaction.client.guilds.cache.get(interaction.guildId!)!.roles.create({
          name: roleName,
          color: resolveColor(color)
        });
        (interaction.member as GuildMember).roles.add(role);
        await message.edit({ embeds: [embed], components: [] });
        response.reply("역할이 생성되었습니다.");
      } else await deleteMessage();
    } catch (error) {
      console.error(error);
      await deleteMessage();
    }
  }
};
