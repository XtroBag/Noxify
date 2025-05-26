// Define the RenderTypes Enum
export enum RenderTypes {
  Default = "default",
  Marching = "marching",
  Walking = "walking",
  Crouching = "crouching",
  Crossed = "crossed",
  CrissCross = "criss_cross",
  Cheering = "cheering",
  Relaxing = "relaxing",
  Trudging = "trudging",
  Cowering = "cowering",
  Pointing = "pointing",
  Lunging = "lunging",
  Dungeons = "dungeons",
  Facepalm = "facepalm",
  Sleeping = "sleeping",
  Dead = "dead",
  Archer = "archer",
  Kicking = "kicking",
  Mojavatar = "mojavatar",
  Reading = "reading",
  HighGround = "high_ground",
  Ultimate = "ultimate",
  Isometric = "isometric",
  Head = "head",
  Bitzel = "bitzel",
  Pixel = "pixel",
  Skin = "skin",
  Profile = "profile",
}

export enum RenderCrops {
  Full = "full",
  Bust = "bust",
  Face = "face",
  Default = "default",
  Processed = "processed",
  BareBones = "barebones",
  Head = "head",
}

interface RenderTypeWithCrop<T extends RenderTypes> {
  type: T;
  crop: RenderCrops | RenderCrops[];
}

export type SkinRenderOptions = {
  [RenderTypes.Default]: RenderTypeWithCrop<RenderTypes.Default>;
  [RenderTypes.Marching]: RenderTypeWithCrop<RenderTypes.Marching>;
  [RenderTypes.Walking]: RenderTypeWithCrop<RenderTypes.Walking>;
  [RenderTypes.Crouching]: RenderTypeWithCrop<RenderTypes.Crouching>;
  [RenderTypes.Crossed]: RenderTypeWithCrop<RenderTypes.Crossed>;
  [RenderTypes.CrissCross]: RenderTypeWithCrop<RenderTypes.CrissCross>;
  [RenderTypes.Cheering]: RenderTypeWithCrop<RenderTypes.Cheering>;
  [RenderTypes.Relaxing]: RenderTypeWithCrop<RenderTypes.Relaxing>;
  [RenderTypes.Trudging]: RenderTypeWithCrop<RenderTypes.Trudging>;
  [RenderTypes.Cowering]: RenderTypeWithCrop<RenderTypes.Cowering>;
  [RenderTypes.Pointing]: RenderTypeWithCrop<RenderTypes.Pointing>;
  [RenderTypes.Lunging]: RenderTypeWithCrop<RenderTypes.Lunging>;
  [RenderTypes.Dungeons]: RenderTypeWithCrop<RenderTypes.Dungeons>;
  [RenderTypes.Facepalm]: RenderTypeWithCrop<RenderTypes.Facepalm>;
  [RenderTypes.Sleeping]: RenderTypeWithCrop<RenderTypes.Sleeping>;
  [RenderTypes.Dead]: RenderTypeWithCrop<RenderTypes.Dead>;
  [RenderTypes.Archer]: RenderTypeWithCrop<RenderTypes.Archer>;
  [RenderTypes.Kicking]: RenderTypeWithCrop<RenderTypes.Kicking>;
  [RenderTypes.Mojavatar]: RenderTypeWithCrop<RenderTypes.Mojavatar>;
  [RenderTypes.Reading]: RenderTypeWithCrop<RenderTypes.Reading>;
  [RenderTypes.HighGround]: RenderTypeWithCrop<RenderTypes.HighGround>;
  [RenderTypes.Ultimate]: RenderTypeWithCrop<RenderTypes.Ultimate>;
  [RenderTypes.Isometric]: RenderTypeWithCrop<RenderTypes.Isometric>;
  [RenderTypes.Head]: RenderTypeWithCrop<RenderTypes.Head>;
  [RenderTypes.Bitzel]: RenderTypeWithCrop<RenderTypes.Bitzel>;
  [RenderTypes.Pixel]: RenderTypeWithCrop<RenderTypes.Pixel>;
  [RenderTypes.Skin]: RenderTypeWithCrop<RenderTypes.Skin>;
  [RenderTypes.Profile]: RenderTypeWithCrop<RenderTypes.Profile>;
};