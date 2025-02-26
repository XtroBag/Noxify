import { CommandTypes, PrefixCommandModule } from "../../../handler/types/Command";

export = {
  name: "emojify",
  aliases: ['e', 'emoji'],
  category: "fun",
  type: CommandTypes.PrefixCommand,
  async execute({ client, message, args }) {
    const text = args.join(" ").trim();

    if (!text) {
      return message.reply("Please provide a message for me to emojify. Add what you want me to emojify after the command and I'll emojify it.");
    }

    if (text.length > 30) {
      return message.reply(
        "Sorry, but the message you added is too long. Please keep it under 30 characters long."
      );
    }

    if (/[^a-zA-Z0-9\s!?€$¥]/.test(text)) {
      return message.reply(
        "Please use letters from the alphabet from [A - Z], numbers [0 - 9], and symbols like [!, ?, €, $, ¥]."
      );
    }

    const emojiMap = {
      a: ":regional_indicator_a:",
      b: ":regional_indicator_b:",
      c: ":regional_indicator_c:",
      d: ":regional_indicator_d:",
      e: ":regional_indicator_e:",
      f: ":regional_indicator_f:",
      g: ":regional_indicator_g:",
      h: ":regional_indicator_h:",
      i: ":regional_indicator_i:",
      j: ":regional_indicator_j:",
      k: ":regional_indicator_k:",
      l: ":regional_indicator_l:",
      m: ":regional_indicator_m:",
      n: ":regional_indicator_n:",
      o: ":regional_indicator_o:",
      p: ":regional_indicator_p:",
      q: ":regional_indicator_q:",
      r: ":regional_indicator_r:",
      s: ":regional_indicator_s:",
      t: ":regional_indicator_t:",
      u: ":regional_indicator_u:",
      v: ":regional_indicator_v:",
      w: ":regional_indicator_w:",
      x: ":regional_indicator_x:",
      y: ":regional_indicator_y:",
      z: ":regional_indicator_z:",
      0: "0️⃣",
      1: "1️⃣",
      2: "2️⃣",
      3: "3️⃣",
      4: "4️⃣",
      5: "5️⃣",
      6: "6️⃣",
      7: "7️⃣",
      8: "8️⃣",
      9: "9️⃣",
      "!": "❗",
      "?": "❓",
      "€": "💶",
      "$": "💲",
      "¥": "💴",
    };

    const emojiText = text
      .toLowerCase()
      .split("")
      .map((char) => emojiMap[char] || (char === " " ? "  " : ""))
      .join("");

    const reply = await message.reply({ content: emojiText });

    client.replies.set(message.id, reply.id);
  },
} as PrefixCommandModule;
