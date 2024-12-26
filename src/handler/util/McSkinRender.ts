import axios from "axios";
import { RenderCrops, RenderTypes } from "../types/StarlightSkinAPI";

export async function getSkinRender(
  renderType: RenderTypes, // Using the RenderTypes enum
  playerName: string,
  renderCrop: RenderCrops // Using the RenderCrops enum
): Promise<Buffer> {  // Changed the return type to Buffer
  try {
    // Construct the API URL
    const url = `https://starlightskins.lunareclipse.studio/render/${renderType}/${playerName}/${renderCrop}`;

    // Send GET request to the API and fetch the image as a buffer
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // If the response status is 200, return the image buffer
    if (response.status === 200 && response.data) {
      return Buffer.from(response.data); // Convert the response data (arraybuffer) to a Buffer
    } else {
      // Handle any case where the API doesn't return valid data (e.g., player not found)
      throw new Error("Player not found or invalid response.");
    }
  } catch (error) {
    console.error("Error fetching skin render:", error);
    throw new Error("Failed to fetch skin render.");
  }
}
