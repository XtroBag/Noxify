import { CommandTypes, PrefixCommandModule } from "../../../handler";
import { EmbedBuilder } from "discord.js";
import { Colors } from "../../../config";

// Command module for the GitHub command
export = {
  name: "github",
  aliases: ["gh"],
  category: "general",
  type: CommandTypes.PrefixCommand,

  // The execute function for the command
  async execute(client, message, args, db): Promise<any> {
    // Retrieve the GitHub username from the arguments
    const name = args.join(" ");

    // If no username is provided, send a reply with instructions and stop further execution
    if (!name) {
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Normal)
            .setDescription("Please provide a GitHub username."),
        ],
      });
      return; // Exit the function if no username is provided
    }

    // Define the GitHub API URL to get the user info
    const userUrl = `https://api.github.com/users/${name}`;
    let userResponse;

    // Fetch the GitHub user data
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

    // If the response doesn't contain the user's login, they were not found
    if (!userResponse.login) {
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Error)
            .setDescription("GitHub user not found!"),
        ],
      });
    }

    // Retrieve followers and following data
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

    // Define the GitHub API URL to get the repositories
    const reposUrl = `https://api.github.com/users/${name}/repos`;
    let reposResponse;

    // Fetch the GitHub repositories
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

    // Create a string to list the repository names, breaking into a new line after every 3 repositories
    let repoNames = "";
    let count = 0;
    reposResponse.forEach((repo, index) => {
      // Add each repository name as inline code
      repoNames += `\`${repo.name}\``;
      count++;

      // Add a comma after each repo except the last one in the group of 3
      if (count % 2 === 0 && index !== reposResponse.length - 1) {
        repoNames += "\n"; // New line after every 3 repos
      } else if (index !== reposResponse.length - 1) {
        repoNames += " "; // Separate with comma if it's not the last one
      }
    });

    // Create the embed with the user's GitHub data
    const embed = new EmbedBuilder()
      .setColor(Colors.Normal)
      .setTitle(`${userResponse.login}`)
      .setURL(userResponse.html_url)
      .setThumbnail(userResponse.avatar_url)
      .setDescription(userResponse.bio || "No Bio") // Bio of the user
      .addFields(
        { name: "Followers:", value: followers, inline: true },
        { name: "Following:", value: following, inline: true },
        {
          name: "Email:",
          value: userResponse.email || "No Email",
          inline: true,
        },
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

    // Send the embed to the channel
    await message.reply({ embeds: [embed] });
  },
} as PrefixCommandModule;
