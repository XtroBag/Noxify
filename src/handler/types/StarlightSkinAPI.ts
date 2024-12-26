export enum RenderCrops {
  Full = "full",
  Bust = "bust",
  Face = "face",
  Default = "default",
  Processed = "processed",
}

export enum RenderTypes {
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
  Ultimate = "ultimate",
  Isometric = "isometric",
  Head = "head",
  Bitzel = "bitzel",
  Pixel = "pixel",
  Skin = "skin",
}

type CommonRenderCrops = RenderCrops.Full | RenderCrops.Bust | RenderCrops.Face;

interface MarchingRenderType {
  type: RenderTypes.Marching;
  crop: CommonRenderCrops;
}
interface WalkingRenderType {
  type: RenderTypes.Walking;
  crop: CommonRenderCrops;
}
interface CrouchingRenderType {
  type: RenderTypes.Crouching;
  crop: CommonRenderCrops;
}
interface CrossedRenderType {
  type: RenderTypes.Crossed;
  crop: CommonRenderCrops;
}
interface CrissCrossRenderType {
  type: RenderTypes.CrissCross;
  crop: CommonRenderCrops;
}
interface CheeringRenderType {
  type: RenderTypes.Cheering;
  crop: CommonRenderCrops;
}
interface RelaxingRenderType {
  type: RenderTypes.Relaxing;
  crop: CommonRenderCrops;
}
interface TrudgingRenderType {
  type: RenderTypes.Trudging;
  crop: CommonRenderCrops;
}
interface CoweringRenderType {
  type: RenderTypes.Cowering;
  crop: CommonRenderCrops;
}
interface PointingRenderType {
  type: RenderTypes.Pointing;
  crop: CommonRenderCrops;
}
interface LungingRenderType {
  type: RenderTypes.Lunging;
  crop: CommonRenderCrops;
}
interface DungeonsRenderType {
  type: RenderTypes.Dungeons;
  crop: CommonRenderCrops;
}
interface FacepalmRenderType {
  type: RenderTypes.Facepalm;
  crop: CommonRenderCrops;
}
interface SleepingRenderType {
  type: RenderTypes.Sleeping;
  crop: RenderCrops.Full | RenderCrops.Bust;
}
interface DeadRenderType {
  type: RenderTypes.Dead;
  crop: CommonRenderCrops;
}
interface ArcherRenderType {
  type: RenderTypes.Archer;
  crop: CommonRenderCrops;
}
interface KickingRenderType {
  type: RenderTypes.Kicking;
  crop: CommonRenderCrops;
}
interface MojavatarRenderType {
  type: RenderTypes.Mojavatar;
  crop: RenderCrops.Full | RenderCrops.Bust;
}
interface UltimateRenderType {
  type: RenderTypes.Ultimate;
  crop: CommonRenderCrops;
}
interface IsometricRenderType {
  type: RenderTypes.Isometric;
  crop: CommonRenderCrops;
}
interface HeadRenderType {
  type: RenderTypes.Head;
  crop: RenderCrops.Full;
}
interface BitzelRenderType {
  type: RenderTypes.Bitzel;
  crop: CommonRenderCrops;
}
interface PixelRenderType {
  type: RenderTypes.Pixel;
  crop: CommonRenderCrops;
}
interface SkinRenderType {
  type: RenderTypes.Skin;
  crop: RenderCrops.Default | RenderCrops.Processed;
}

export type SkinRenderOptions =
  | MarchingRenderType
  | WalkingRenderType
  | CrouchingRenderType
  | CrossedRenderType
  | CrissCrossRenderType
  | CheeringRenderType
  | RelaxingRenderType
  | TrudgingRenderType
  | CoweringRenderType
  | PointingRenderType
  | LungingRenderType
  | DungeonsRenderType
  | FacepalmRenderType
  | SleepingRenderType
  | DeadRenderType
  | ArcherRenderType
  | KickingRenderType
  | MojavatarRenderType
  | UltimateRenderType
  | IsometricRenderType
  | HeadRenderType
  | BitzelRenderType
  | PixelRenderType
  | SkinRenderType;
