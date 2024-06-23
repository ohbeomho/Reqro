import { discordEnv, testEnv, nodeEnv } from "./config";
import { Client, Events, IntentsBitField, REST, Routes } from "discord.js";
import { loadCommands } from "./commands";

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers],
});

const { BOT_TOKEN, CLIENT_ID } = discordEnv;
const { TEST_GUILD_ID } = testEnv;

if (nodeEnv === "dev") console.log("DEVELOPMENT MODE");

(async () => {
  const commands = await loadCommands();
  const rest = new REST().setToken(BOT_TOKEN!);

  client.once(Events.ClientReady, (readyClient) =>
    console.log(`로그인됨: ${readyClient.user.tag}`),
  );
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.inGuild() || !interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        content: `명령어 \`${interaction.commandName}\`는 존재하지 않습니다.`,
        ephemeral: true,
      });
      return;
    }

    try {
      await command.func(interaction);
    } catch (e) {
      console.error(e);
      if (interaction.deferred)
        await interaction.editReply({
          content: "명령어 실행 중 오류가 발생하였습니다.",
        });
      if (!interaction.replied)
        await interaction.reply({
          content: "명령어 실행 중 오류가 발생하였습니다.",
          ephemeral: true,
        });
    }
  });

  try {
    console.log("명령어 등록 시작");
    await rest.put(
      nodeEnv === "dev"
        ? Routes.applicationGuildCommands(CLIENT_ID!, TEST_GUILD_ID!)
        : Routes.applicationCommands(CLIENT_ID!),
      {
        body: Array.from(commands.values()).map((command) =>
          command.data.toJSON(),
        ),
      },
    );
    console.log("명령어 등록됨");
  } catch (error) {
    console.error(error);
  }

  client.login(BOT_TOKEN);
})();
