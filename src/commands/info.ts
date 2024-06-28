import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from ".";
import path from "path";

export const command: Command = {
  data: new SlashCommandBuilder().setName("info").setDescription("Reqro 봇의 정보를 표시합니다."),
  func: async (interaction) => {
    await interaction.deferReply();

    const colorPickerImage = new AttachmentBuilder(path.join(__dirname, "..", "assets", "color-picker.png"), { name: "color-picker.png" });
    const embed = new EmbedBuilder()
      .setTitle("Reqro")
      .setDescription(
        `
개발자: **ohbeomho**
[소스코드](https://github.com/ohbeomho/Reqro)

### 사용법

**역할 요청**
\`/request\` 명령어 사용

**명령어 옵션**
- \`name\`: 역할의 이름
- \`color\`: 역할의 색상 (HEX Color)

_(HEX Color 를 모르거나 직접 입력하기 귀찮으면 [색상 선택기](https://www.google.com/search?q=color+picker)에서 색 선택 후 HEX 값 복사&붙여넣기)_`
      )
      .setThumbnail(interaction.client.user.avatarURL())
      .setImage(`attachment://${colorPickerImage.name}`);
    await interaction.editReply({ embeds: [embed], files: [colorPickerImage] });
  }
};
