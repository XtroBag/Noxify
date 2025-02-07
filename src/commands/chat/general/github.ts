import { CommandTypes, PrefixCommandModule } from "../../../handler/types/Command";
import { EmbedBuilder } from "discord.js";
import { Colors } from "../../../config";

export = {
  name: "github",
  aliases: ["gh"],
  category: "general",
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    const name = args.join(" ");

    if (!name) {
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setDescription("Please provide a GitHub username."),
        ],
      });
      return;
    }

    const userUrl = `https://api.github.com/users/${name}`;
    let userResponse;

    userResponse = await fetch(userUrl)
      .then((res) => res.json())
      .catch(async () => {
        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Error)
              .setDescription("Something went wrong while fetching the data!"),
          ],
        });
        return;
      });

    if (!userResponse.login) {
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription("GitHub user not found!"),
        ],
      });
    }

    let followers = "0";
    let following = "0";

    try {
      following = userResponse.following
        ? userResponse.following.toLocaleString()
        : "0";
    } catch (err) {
      following = "0";
    }

    try {
      followers = userResponse.followers
        ? userResponse.followers.toLocaleString()
        : "0";
    } catch (err) {
      followers = "0";
    }

    const reposUrl = `https://api.github.com/users/${name}/repos`;
    let reposResponse: any[];

    reposResponse = await fetch(reposUrl)
      .then((res) => res.json())
      .catch(async () => {
        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Error)
              .setDescription(
                "Something went wrong while fetching the repositories!"
              ),
          ],
        });
        return;
      });

    let repoNames = "";
    let count = 0;
    reposResponse.forEach((repo, index) => {
      repoNames += `\`${repo.name}\``;
      count++;

      if (count % 2 === 0 && index !== reposResponse.length - 1) {
        repoNames += "\n";
      } else if (index !== reposResponse.length - 1) {
        repoNames += " ";
      }
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setTitle(`${userResponse.login}`)
      .setURL(userResponse.html_url)
      .setThumbnail(userResponse.avatar_url)
      .setDescription(userResponse.bio || "No Bio")
      .addFields(
        { name: "Followers:", value: followers, inline: true },
        { name: "Following:", value: following, inline: true },
        {
          name: "Company:",
          value: userResponse.company || "No Company",
          inline: true,
        },
        {
          name: "Location:",
          value: userResponse.location || "No Location",
          inline: true,
        },
        {
          name: "Repositories:",
          value: repoNames || "No repositories available.",
          inline: false,
        }
      );

    await message.reply({ embeds: [embed] });
  },
} as PrefixCommandModule;
