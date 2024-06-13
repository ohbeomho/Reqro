import "dotenv/config";
import { Client, Events, IntentsBitField, REST, Routes } from "discord.js";
import { loadCommands } from "./commands";

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers]
});

(async () => {
  const commands = await loadCommands();
  const rest = new REST().setToken(process.env.BOT_TOKEN!);

  client.once(Events.ClientReady, (readyClient) => console.log(`로그인됨: ${readyClient.user.tag}`));
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.inGuild() || !interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({ content: `명령어 \`${interaction.commandName}\`는 존재하지 않습니다.`, ephemeral: true });
      return;
    }

    await command.func(interaction);
  });

  try {
    console.log("명령어 등록 시작");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.NODE_ENV === "dev" ? process.env.TEST_GUILD_ID! : process.env.GUILD_ID!
      ),
      {
        body: Array.from(commands.values()).map((command) => command.data.toJSON())
      }
    );
    console.log("명령어 등록됨");
  } catch (error) {
    console.error(error);
  }

  client.login(process.env.BOT_TOKEN);
})();
