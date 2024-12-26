import { RenderCrops, RenderTypes } from "../types/StarlightSkinAPI";

export async function getSkinRender(
  renderType: RenderTypes, // Using the RenderTypes enum
  playerName: string,
  renderCrop: RenderCrops // Using the RenderCrops enum
): Promise<Buffer> {  // Return type is Buffer
  // Construct the API URL
  const url = `https://starlightskins.lunareclipse.studio/render/${renderType}/${playerName}/${renderCrop}`;

  // Send GET request to the API and fetch the image as a buffer
  const response = await fetch(url);

  if (!response.ok) {
    // If the response is not OK, handle different status codes
    if (response.status === 404) {
      throw new Error("Player not found. Please check the username and try again.");
    } else if (response.status === 400) {
      throw new Error("Bad request. Please check the player name or render options.");
    } else {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
  }

  // If the response is OK (status 200-299), retrieve the image data
  const arrayBuffer = await response.arrayBuffer(); // Use arrayBuffer instead of buffer
  return Buffer.from(arrayBuffer);  // Convert arrayBuffer to a Buffer
}
