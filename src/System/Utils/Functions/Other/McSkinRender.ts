import { RenderCrops, RenderTypes, SkinRenderOptions } from "../../../Types/StarlightSkinAPI.js";

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

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function getRenderTypeCrops<T extends RenderTypes>(
  renderType: T
): SkinRenderOptions[T]["crop"] {
  const renderTypeMapping: Record<RenderTypes, SkinRenderOptions[RenderTypes]> =
    {
      [RenderTypes.Default]: {
        type: RenderTypes.Default,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Marching]: {
        type: RenderTypes.Marching,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Walking]: {
        type: RenderTypes.Walking,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Crouching]: {
        type: RenderTypes.Crouching,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Crossed]: {
        type: RenderTypes.Crossed,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.CrissCross]: {
        type: RenderTypes.CrissCross,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Ultimate]: {
        type: RenderTypes.Ultimate,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Isometric]: {
        type: RenderTypes.Isometric,
        crop: [
          RenderCrops.Full,
          RenderCrops.Bust,
          RenderCrops.Face,
          RenderCrops.Head,
        ],
      },
      [RenderTypes.Head]: { type: RenderTypes.Head, crop: RenderCrops.Full },
      [RenderTypes.Cheering]: {
        type: RenderTypes.Cheering,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Relaxing]: {
        type: RenderTypes.Relaxing,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Trudging]: {
        type: RenderTypes.Trudging,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Cowering]: {
        type: RenderTypes.Cowering,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Pointing]: {
        type: RenderTypes.Pointing,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Lunging]: {
        type: RenderTypes.Lunging,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Dungeons]: {
        type: RenderTypes.Dungeons,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Facepalm]: {
        type: RenderTypes.Facepalm,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Sleeping]: {
        type: RenderTypes.Sleeping,
        crop: [RenderCrops.Full, RenderCrops.Bust],
      },
      [RenderTypes.Dead]: {
        type: RenderTypes.Dead,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Archer]: {
        type: RenderTypes.Archer,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Kicking]: {
        type: RenderTypes.Kicking,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Mojavatar]: {
        type: RenderTypes.Mojavatar,
        crop: [RenderCrops.Full, RenderCrops.Bust],
      },
      [RenderTypes.Reading]: {
        type: RenderTypes.Reading,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.HighGround]: {
        type: RenderTypes.HighGround,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Bitzel]: {
        type: RenderTypes.Bitzel,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Pixel]: {
        type: RenderTypes.Pixel,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
      [RenderTypes.Skin]: {
        type: RenderTypes.Skin,
        crop: [
          RenderCrops.Default,
          RenderCrops.Processed,
          RenderCrops.BareBones,
        ],
      },
      [RenderTypes.Profile]: {
        type: RenderTypes.Profile,
        crop: [RenderCrops.Full, RenderCrops.Bust, RenderCrops.Face],
      },
    };

  return renderTypeMapping[renderType].crop;
}

