import Logger from "../System/Utils/Functions/Handlers/Logger.js";
import { ActivitiesOptions, ActivityType, Events } from "discord.js";
import { EventModule } from "../System/Types/Event.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute({ client, args: [readyClient] }) {
    if (!client.user) return;

    const serverAmount = (await client.guilds.fetch()).size.toString();
    let today = new Date().toISOString().slice(5, 10);

    const events: Record<string, ActivitiesOptions> = {
      "01-01": { name: "Happy New Year! 🎇", type: ActivityType.Custom },
      "02-06": { name: "Happy Birthday, XtroBag! 🎂", type: ActivityType.Custom },
      "02-14": { name: "Happy Valentine's Day! ❤️", type: ActivityType.Custom },
      "03-17": { name: "Happy Saint Patrick's Day! 🍀", type: ActivityType.Custom },
      "04-01": { name: "April Fools! 🤡", type: ActivityType.Custom },
      "04-20": { name: "Happy Easter! 🥚", type: ActivityType.Custom },
      "05-04": { name: "May The Fourth Be With You! ⭐️", type: ActivityType.Custom },
      "05-26": { name: "Honor the Fallen. 🥀 ", type: ActivityType.Custom },
      "06-19": { name: "Happy Juneteenth! ✊🏿", type: ActivityType.Custom },
      "07-04": { name: "Happy Independence Day! 🎆", type: ActivityType.Custom },
      "10-13": { name: "Happy Birthday, BroBoiler! 🎂", type: ActivityType.Custom },
      "10-31": { name: "Happy Halloween! 🎃", type: ActivityType.Custom },
      "11-11": { name: "Happy Veterans Day! 🇺🇸", type: ActivityType.Custom },
      "11-27": { name: "Happy Thanksgiving! 🦃", type: ActivityType.Custom },
      "12-25": { name: "Merry Christmas! 🎄", type: ActivityType.Custom },
    };

    const status: ActivitiesOptions[] = [
      { name: `${serverAmount} Servers`, type: ActivityType.Watching },
      { name: `Use .help for Commands`, type: ActivityType.Custom },
      { name: `Chats`, type: ActivityType.Watching },
    ];

    let index = 0;
    const statusInterval = 25_000; // 25 seconds

    const isEventActive = events[today] !== undefined;
    
    if (isEventActive) {
      Logger.log(`Seasonal Status Active: ${events[today].name}`);
    }

    const updateStatus = () => {
      if (isEventActive) {
        return client.user.setPresence({ activities: [events[today]], status: "online" });
      }

      if (index === status.length) index = 0;
      client.user.setPresence({ activities: [status[index]], status: "online" });
      index++;
    };

    updateStatus();
    setInterval(updateStatus, statusInterval);

    Logger.log(`Ready! Logged in as ${readyClient.user.tag}`);
  },
} as EventModule<"ready">;
