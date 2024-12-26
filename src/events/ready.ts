import Logger from "../handler/util/Logger";
import { Events, ActivityType } from "discord.js";
import { EventModule } from "../handler";
import { DiscordClient } from "../handler/util/DiscordClient";

export = {
    name: Events.ClientReady,
    once: true,
    async execute(client: DiscordClient): Promise<void> {
        if (!client.user) return;

        // Function to calculate the birthday countdown
        function birthdayCountdown(): string {
            const today = new Date();
            const birthday = new Date(today.getFullYear(), 1, 6); // February 6th of this year

            // If the birthday has already passed this year, set it to next year
            if (today > birthday) {
                birthday.setFullYear(today.getFullYear() + 1);
            }

            // Calculate the difference in milliseconds
            const timeDiff = birthday.getTime() - today.getTime();

            // If it's your birthday today, return the birthday message
            if (timeDiff <= 0) {
                return "Happy Birthday Sean!";
            }

            // Calculate the remaining days
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Round up to the next day if any time is remaining

            return `${daysLeft} days until sean's birthday!`;
        }

        // Function to update the bot's status
        function updateBotStatus() {
            const countdown = birthdayCountdown();
            client.user.setPresence({
                status: 'online',
                activities: [{ name: 'Birthday Countdown', state: countdown, type: ActivityType.Custom }],
            });
        }

        // Initially set the bot's status
        updateBotStatus();
        
        // Update the bot's status every 30 seconds
        setInterval(updateBotStatus, 30 * 1000);

        Logger.log(`Ready! Logged in as ${client.user.tag}`);
    }
} as EventModule;
