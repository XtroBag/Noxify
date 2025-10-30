import { MessageFlags, SlashCommandBuilder } from "discord.js";
import Command from "../../types/Command";

export enum PlayerType {
  Java = "java",
  Bedrock = "bedrock",
}

export interface JavaPlayer {
  edition: PlayerType.Java;
  username: string;
  uuid: string;
  skin: string;
  cape: string;
  linked: boolean;
  bedrock_gamertag?: string;
  bedrock_xuid?: string;
  bedrock_fuid?: string;
}

export interface BedrockPlayer {
  edition: PlayerType.Bedrock;
  gamertag: string;
  xuid: string;
  floodgateuid: string;
  icon: string;
  gamescore: string;
  accounttier: string;
  textureid: string;
  skin: string;
  linked: boolean;
  java_uuid: string;
  java_name: string;
}

export type MinecraftPlayer = JavaPlayer | BedrockPlayer;

function formatPlayerData(player: MinecraftPlayer): string {
  if (player.edition === PlayerType.Java) {
    return `✅ Found Java player!

**Username:** ${player.username}
**UUID:** ${player.uuid}
**Skin:** [View Skin](<${player.skin}>)
**Cape:** [View Cape](<${player.cape}>)`;
  } else {
    return `✅ Found Bedrock player!
    
**Gamertag:** ${player.gamertag}
**XUID:** ${player.xuid}
**Skin:** [View Skin](<${player.skin}>)`;
  }
}

export default new Command({
  data: new SlashCommandBuilder()
    .setName("mcuser")
    .setDescription("Search for a Minecraft user by their username")
    .addStringOption((option) =>
      option
        .setName("edition")
        .setDescription("The Minecraft edition")
        .setRequired(true)
        .addChoices(
          { name: "Java", value: PlayerType.Java },
          { name: "Bedrock", value: PlayerType.Bedrock }
        )
    )
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The Minecraft username")
        .setRequired(true)
    ),
  options: {
    enabled: true,
    developerOnly: false,
  },
  execute: async ({ client, interaction }) => {
    const edition = interaction.options.getString(
      "edition",
      true
    ) as PlayerType;
    const username = interaction.options.getString("username", true);

    const baseUrl = "https://mcprofile.io/api/v1";
    const endpoint =
      edition === PlayerType.Java
        ? `/java/username/${username}`
        : `/bedrock/gamertag/${username}`;

    const url = `${baseUrl}${endpoint}`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        await interaction.reply({
          content: `❌ Failed to fetch data: ${res.status} ${res.statusText}`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const data = await res.json();

      const playerData: MinecraftPlayer =
        edition === PlayerType.Java
          ? { edition: PlayerType.Java, ...data }
          : { edition: PlayerType.Bedrock, ...data };

      const message = formatPlayerData(playerData);

      await interaction.reply({
        content: message,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ An error occurred while fetching the user data.",
        ephemeral: true,
      });
    }
  },
});
