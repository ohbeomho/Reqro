import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from ".";
import { envVars, testEnvVars } from "../config";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("request")
    .setDescription("역할 생성을 요청합니다.")
    .addStringOption((o) => o.setName("name").setDescription("역할의 이름").setRequired(true))
    .addStringOption((o) => o.setName("color").setDescription("역할의 색상 (HEX Color)").setRequired(true)),
  func: async (interaction) => {
    if (interaction.channelId !== (envVars.NODE_ENV === "dev" ? testEnvVars.TEST_REQUEST_CHANNEL_ID : envVars.REQUEST_CHANNEL_ID)) {
      await interaction.reply({ content: "역할 요청 채널이 아닙니다.", ephemeral: true });
      return;
    }

    let roleName = String(interaction.options.get("name", true).value),
      roleColor = String(interaction.options.get("color", true).value);
    if (roleColor.startsWith("#")) roleColor = roleColor.substring(1);
    const embed = new EmbedBuilder()
      .setTitle(interaction.user.tag + "의 역할 요청")
      .setDescription(`역할 이름: **${roleName}**\n역할 색상: **${roleColor}**`)
      .setColor(parseInt(roleColor, 16));
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("accept").setLabel("수락").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("reject").setLabel("거절").setStyle(ButtonStyle.Danger)
    );
    const message = await (
      interaction.client.channels.cache.get(
        String(envVars.NODE_ENV === "dev" ? testEnvVars.TEST_REVIEW_CHANNEL_ID : envVars.REVIEW_CHANNEL_ID)
      ) as TextChannel
    ).send({ embeds: [embed], components: [actionRow] });
    await interaction.reply({ content: "역할 요청이 생성되었습니다.", ephemeral: true });

    const deleteMessage = () =>
      (
        interaction.client.channels.cache.get(
          String(envVars.NODE_ENV === "dev" ? testEnvVars.TEST_REVIEW_CHANNEL_ID : envVars.REVIEW_CHANNEL_ID)
        ) as TextChannel
      ).messages.delete(message);

    try {
      // 6시간 후 자동으로 요청 삭제
      const response = await message.awaitMessageComponent({
        filter: (i) => i.member.permissions.has("Administrator"),
        time: 3600_000 * 6
      });

      if (response.customId === "accept") {
        const role = await interaction.client.guilds.cache
          .get(String(envVars.NODE_ENV === "dev" ? testEnvVars.TEST_GUILD_ID : envVars.GUILD_ID))!
          .roles.create({
            name: roleName,
            color: parseInt(roleColor, 16)
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

export default command;
