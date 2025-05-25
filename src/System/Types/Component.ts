import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  Collection,
  Interaction,
  ModalSubmitInteraction,
} from "discord.js";
import { DiscordClient } from "../Utils/Functions/Handlers/DiscordClient.js";

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
  buttons: Collection<string, ComponentModule<ButtonInteraction<'cached'>>>;
  selectMenus: Collection<string, ComponentModule<AnySelectMenuInteraction<'cached'>>>;
  modals: Collection<string, ComponentModule<ModalSubmitInteraction<'cached'>>>;
}

export enum ComponentTypes {
  Button = "buttons",
  SelectMenu = "selectMenus",
  Modal = "modals",
}
