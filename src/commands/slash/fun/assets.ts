import SGDB, { SGDBImage } from "steamgriddb";
import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler/types/Command";
import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  AttachmentBuilder,
} from "discord.js";
import { createEmbed, getImageUrl } from "../../../handler/util/AssetsGenerators";

// This has a "unknown message" error happening
// C:\Users\scgra\Desktop\Noxify\dist\commands\slash\fun\assets.js:123:13

const sgdb = new SGDB({
  key: process.env.SGDB_APIKEY,
  baseURL: "https://www.steamgriddb.com/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  disabled: false,
  ownerOnly: false,
  data: new SlashCommandBuilder()
    .setName("assets")
    .setDescription(
      "Get user-generated assets from SteamGridDB about a game you choose"
    )
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
    ])
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Enter the name of the game you want to search.")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Choose an option type")
        .setChoices([
          { name: "Grid", value: "grid" },
          { name: "Hero", value: "hero" },
          { name: "Logo", value: "logo" },
          { name: "Icon", value: "icon" },
        ])
        .setRequired(true)
    ),

  async execute({ client, interaction }) {
    const gameID = Number(interaction.options.getString("game"));
    const type = interaction.options.getString("type");

    await interaction.deferReply({ fetchReply: true }); // could be this

    if (gameID === null) return;

    const game = await sgdb.getGameById(gameID).catch(() => {});
    if (!game) {
      return await interaction.editReply("Game not found, please try again with a valid game name.");
    }

    let icons: SGDBImage[] = [];

    switch (type) {
      case "grid":
        icons = await sgdb.getGridsById(game.id, [
          "alternate",
          "white_logo",
          "no_logo",
        ]);
        break;
      case "hero":
        icons = await sgdb.getHeroesById(game.id, ["alternate"]);
        break;
      case "logo":
        icons = await sgdb.getLogosById(game.id, ["official"]);
        break;
      case "icon":
        icons = await sgdb.getIconsById(game.id, ["official"]);
        break;
    }

    if (!icons || icons.length === 0) {
      return await interaction.editReply("No icons found for this game.");
    }

    let currentPage = 0;


    let iconUrl = await getImageUrl(icons[currentPage].url.toString());
    const image = icons[currentPage]; // Assuming 'creator' is a field that contains the artist's information

    const embed = createEmbed(iconUrl, currentPage, icons.length, game, image);

    const nextButton = new ButtonBuilder()
      .setCustomId(`assestNext`)
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(icons.length <= 1);

    const prevButton = new ButtonBuilder()
      .setCustomId(`assestReturn`)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      prevButton,
      nextButton
    );

   const message = await interaction.editReply({
      embeds: [embed],
      components: [actionRow],
      files: iconUrl instanceof AttachmentBuilder ? [iconUrl] : [],
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({
      filter,
      time: 600000,
    });

    collector.on("collect", async (button) => {
      if (button.customId === "assestNext") {
        currentPage++;
      } else if (button.customId === "assestReturn") {
        currentPage--;
      }

      iconUrl = await getImageUrl(icons[currentPage].url.toString());
      const newEmbed = createEmbed(
        iconUrl,
        currentPage,
        icons.length,
        game,
        icons[currentPage]
      );

      nextButton.setDisabled(currentPage === icons.length - 1);
      prevButton.setDisabled(currentPage === 0);

      await button.update({
        embeds: [newEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            prevButton,
            nextButton
          ),
        ],
        files: iconUrl instanceof AttachmentBuilder ? [iconUrl] : [],
      });
    });

    collector.on('ignore', async (button) => {
      return await button.reply({ content: "You can't use this menu", ephemeral: true })
    })

    collector.on("end", async () => {
      await message.edit({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            prevButton.setDisabled(true),
            nextButton.setDisabled(true)
          ),
        ],
      });
    });
 },

 async autocomplete(interaction, client) {
  const search = interaction.options.getFocused(false);

  if (!search || search.length === 0) {
    return await interaction.respond([
      { name: "Please provide a game to search", value: "" },
    ]);
  }

  try {
    const games = await sgdb.searchGame(search);

    if (!games || games.length === 0) {
      return await interaction.respond([
        { name: "No games found matching your search", value: "" },
      ]);
    }

    const choices = games.map((game) => ({
      name: game.name,
      value: game.id.toString(),
    }));

    await interaction.respond(choices);
  } catch (error) {
    await interaction.respond([
      { name: "Error occurred while searching. Try again later.", value: "" },
    ]);
  }
}

} as SlashCommandModule;
