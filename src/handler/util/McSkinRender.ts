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

  // Check if the response is not OK
  if (!response.ok) {
    // Handle the specific HTTP status codes
    switch (response.status) {
      case 404:
        // Player not found
        throw new Error("Player not found. Please check the username and try again.");
      case 400:
        // Bad request
        throw new Error("Bad request. Please check the player name or render options.");
      case 503:
        // Service unavailable (website might be down)
        throw new Error("The service is currently unavailable. Please try again later.");
      case 500:
        // Internal server error (API issue)
        throw new Error("There was a problem. Please try again later or check the information you provided.");
      default:
        // Generic error for any other status code
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
  }

  // If the response is OK (status 200-299), retrieve the image data
  const arrayBuffer = await response.arrayBuffer(); // Use arrayBuffer instead of buffer
  return Buffer.from(arrayBuffer);  // Convert arrayBuffer to a Buffer
}
