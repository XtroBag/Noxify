import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  Collection,
  Interaction,
  ModalSubmitInteraction,
} from "discord.js";
import { DiscordClient } from "../util/DiscordClient";

export interface ComponentModule<T extends Interaction = Interaction<'cached'>> {
  id?: string;
  type: ComponentTypes;
  execute: (
    client: DiscordClient,
    interaction: T,
    params: Record<string, string>
  ) => Promise<any>;
}

export interface ComponentCollections {
  buttons: Collection<string, ComponentModule<ButtonInteraction>>;
  selectMenus: Collection<string, ComponentModule<AnySelectMenuInteraction>>;
  modals: Collection<string, ComponentModule<ModalSubmitInteraction>>;
}

export enum ComponentTypes {
  Button = "buttons",
  SelectMenu = "selectMenus",
  Modal = "modals",
}
