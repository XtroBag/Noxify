import axios from "axios";
import { AttachmentBuilder, EmbedBuilder, inlineCode } from "discord.js";
import { isICO, parseICO } from "icojs";
import sharp from "sharp";
import { Colors } from "../../config";
import { SGDBGame, SGDBImage } from "steamgriddb";

export async function getImageUrl(
  iconUrl: string
): Promise<AttachmentBuilder | string> {
  if (iconUrl.endsWith(".ico")) {
    const attachment = await convertIconToPNG(iconUrl);
    return attachment;
  }
  return iconUrl;
}

export async function convertIconToPNG(
  iconUrl: string
): Promise<AttachmentBuilder> {
  try {
    const response = await axios.get(iconUrl, { responseType: "arraybuffer" });
    const iconBuffer = Buffer.from(response.data);
    if (!isICO(iconBuffer)) {
      throw new Error("The provided file is not a valid .ico format.");
    }
    const images = await parseICO(iconBuffer);
    if (!images || images.length === 0) {
      throw new Error("No images found in the .ico file.");
    }
    const firstImage = images[0];
    const pngBuffer = await sharp(firstImage.buffer).toFormat("png").toBuffer();
    return new AttachmentBuilder(pngBuffer, { name: "icon.png" });
  } catch (error) {
    console.error("Error converting .ico to PNG:", error);
    throw error;
  }
}

export function createEmbed(
  iconUrl: string | AttachmentBuilder,
  index: number,
  total: number,
  game: SGDBGame,
  image?: SGDBImage
) {
  const imageUrl =
    iconUrl instanceof AttachmentBuilder
      ? `attachment://${iconUrl.name}`
      : iconUrl;

  const embed = new EmbedBuilder()
    .setTitle(game.name)
    .setURL(image.url.toString())
    .setColor(Colors.Normal)
    .setImage(imageUrl)
    .setFooter({ text: `Image ${index + 1} of ${total}` });

    if (image.notes) {
      embed.setDescription(image.notes)
    }

  if (image) {
    embed.setAuthor({
      name: `${image.author.name}`,
      iconURL: image.author.avatar.toString(),
    });
  }

  return embed;
}
