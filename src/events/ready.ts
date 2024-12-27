import Logger from "../handler/util/Logger";
import { Events, ActivityType } from "discord.js";
import { EventModule } from "../handler";

export = {
  name: Events.ClientReady,
  once: true,
  async execute({ client, args: [readyClient] }) {
    if (!client.user) return;

    function birthdayCountdown(): string {
      const today = new Date();
      const birthday = new Date(today.getFullYear(), 1, 6);

      if (today > birthday) {
        birthday.setFullYear(today.getFullYear() + 1);
      }

      const timeDiff = birthday.getTime() - today.getTime();

      if (timeDiff <= 0) {
        return "Happy Birthday Sean!";
      }

      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return `${daysLeft} days until sean's birthday!`;
    }

    function updateBotStatus() {
      const countdown = birthdayCountdown();
      readyClient.user.setPresence({
        status: "online",
        activities: [
          {
            name: "Birthday Countdown",
            state: countdown,
            type: ActivityType.Custom,
          },
        ],
      });
    }

    updateBotStatus();

    setInterval(updateBotStatus, 30 * 1000);

    Logger.log(`Ready! Logged in as ${readyClient.user.tag}`);
  },
} as EventModule<"ready">;
