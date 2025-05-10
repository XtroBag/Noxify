// import {
//   Message,
//   ActionRow,
//   ActionRowBuilder,
//   MessageActionRowComponent,
//   ButtonComponent,
//   APIButtonComponent,
//   ButtonBuilder,
//   ComponentType,
// } from "discord.js";

// function isButtonActionRow(
//   components: MessageActionRowComponent[]
// ): components is ButtonComponent[] {
//   return components.every(
//     (component) => component.type === ComponentType.Button
//   );
// }

// function createDisabledButtonsActionRowArray(
//   componentsRow: Array<ActionRow<MessageActionRowComponent>>
// ): Array<ActionRowBuilder<ButtonBuilder>> {
//   const disabledButtonComponents: Array<ActionRowBuilder<ButtonBuilder>> = [];

//   for (const row of componentsRow) {
//     const { components } = row;

//     if (isButtonActionRow(components)) {
//       disabledButtonComponents.push(createDisabledButtonsActionRow(components));
//     }
//   }

//   return disabledButtonComponents;
// }

// function createDisabledButtonsActionRow(
//   components: ButtonComponent[]
// ): ActionRowBuilder<ButtonBuilder> {
//   return new ActionRowBuilder<ButtonBuilder>().setComponents(
//     createDisabledButtons(components)
//   );
// }

// function createDisabledButtons(components: Array<ButtonComponent>) {
//   return components.map(({ data }) => createDisabledButton(data));
// }

// function createDisabledButton(component: Readonly<APIButtonComponent>) {
//   return new ButtonBuilder(component).setDisabled(true);
// }

// export async function disabledButtonActionRows(
//   message: Message
// ): Promise<Message> {
//   return message.edit({
//     components: createDisabledButtonsActionRowArray(message.components),
//   });
// }
