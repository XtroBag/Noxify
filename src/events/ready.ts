import Logger from "../handler/util/Logger";
import { ActivitiesOptions, ActivityType, Events } from "discord.js";
import { EventModule } from "../handler/types/EventModule";

export = {
  name: Events.ClientReady,
  once: true,
  async execute({ client, args: [readyClient] }) {
    if (!client.user) return;

    const serverAmount = (await client.guilds.fetch()).size.toString();
    let today = new Date().toISOString().slice(5, 10); // Get MM-DD format

    // today = '';

    const seasonalStatuses: Record<string, ActivitiesOptions> = {
      "01-01": { name: "Happy New Year! 🎇", type: ActivityType.Custom },
      "02-06": { name: "Happy Birthday, XtroBag! 🎂", type: ActivityType.Custom },
      "02-14": { name: "Happy Valentine's Day! ❤️", type: ActivityType.Custom },
      "03-17": { name: "Happy Saint Patrick's Day! 🍀", type: ActivityType.Custom },
      "04-01": { name: "April Fools! 🤡", type: ActivityType.Custom },
      "04-05": { name: "Happy Easter! 🥚", type: ActivityType.Custom }, // Need to keep changing this every year
      "05-04": { name: "May The Fourth Be With You! ⭐️", type: ActivityType.Custom },
      "05-26": { name: "Honor the Fallen. 🥀 ", type: ActivityType.Custom }, // Need to keep changing this every year
      "06-19": { name: "Happy Juneteenth! ✊🏿", type: ActivityType.Custom },
      "07-04": { name: "Happy Independence Day! 🎆", type: ActivityType.Custom },
      "10-13": { name: "Happy Birthday, BroBoiler! 🎂", type: ActivityType.Custom },
      "10-31": { name: "Happy Halloween! 🎃", type: ActivityType.Custom },
      "11-11": { name: "Happy Veterans Day! 🇺🇸", type: ActivityType.Custom },
      "11-27": { name: "Happy Thanksgiving! 🦃", type: ActivityType.Custom }, // Need to keep changing this every year
      "12-25": { name: "Merry Christmas! 🎄", type: ActivityType.Custom },
    };

    const statusList: ActivitiesOptions[] = [
      { name: `${serverAmount} Servers`, type: ActivityType.Watching },
      { name: `Use .help for Commands`, type: ActivityType.Custom },
      { name: `Chats`, type: ActivityType.Watching },
    ];

    let index = 0;
    const statusInterval = 25_000; // 25 seconds

    const updateStatus = () => {
      if (seasonalStatuses[today]) {
        client.user.setPresence({ activities: [seasonalStatuses[today]], status: "online" });
        Logger.debug(`Seasonal Status Active: ${seasonalStatuses[today].name}`);
        return;
      }

      if (index === statusList.length) index = 0;
      const status = statusList[index];
      client.user.setPresence({ activities: [status], status: "online" });
      index++;
    };

    updateStatus();
    setInterval(updateStatus, statusInterval);

    Logger.log(`Ready! Logged in as ${readyClient.user.tag}`);
  },
} as EventModule<"ready">;
