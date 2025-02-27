import { Message, TextChannel } from "discord.js";
import { Server } from "../../../handler/schemas/models/Models";
import { defaultPrefix } from "../../../config";

export async function autoSlowmodeSystem(message: Message) {
    const search = await Server.findOne({ guildID: message.guildId });
    if (!search) await Server.create({
        name: message.guild.name,
        guildID: message.guildId,
        prefix: defaultPrefix
    })

    const guild = await Server.findOne({ guildID: message.guildId });

    if (guild.autoSlowmode.enabled) {

        const currentTime = Date.now();
        const timeWindows = [10 * 1000, 25 * 1000, 30 * 1000];

        guild.autoSlowmode.messageCounts = guild.autoSlowmode.messageCounts.filter(
            entry => currentTime - entry.timestamp <= timeWindows[2]
        );

        let existingEntry = guild.autoSlowmode.messageCounts.find(entry => currentTime - entry.timestamp < 1000);
        if (existingEntry) {
            existingEntry.count += 1;
        } else {
            guild.autoSlowmode.messageCounts.push({ timestamp: currentTime, count: 1 });
        }

        await guild.save();

        let count10s = 0, count20s = 0, count30s = 0;
        guild.autoSlowmode.messageCounts.forEach(entry => {
            if (currentTime - entry.timestamp <= timeWindows[0]) count10s += entry.count;
            if (currentTime - entry.timestamp <= timeWindows[1]) count20s += entry.count;
            if (currentTime - entry.timestamp <= timeWindows[2]) count30s += entry.count;
        });

        let newSlowmode = 0;
        if (count30s >= 30) {
            newSlowmode = guild.autoSlowmode.highestTime;
        } else if (count20s >= 25) {
            newSlowmode = guild.autoSlowmode.moderateTime;
        } else if (count10s >= 10) {
            newSlowmode = guild.autoSlowmode.shortestTime;
        }

        const channel = message.channel as TextChannel;

        if (newSlowmode === 0 && channel.rateLimitPerUser > 0) {
            await channel.setRateLimitPerUser(0);
            console.log(`Removed slowmode in #${channel.name}`);
        }

        else if (newSlowmode > 0 && channel.rateLimitPerUser !== newSlowmode) {
            await channel.setRateLimitPerUser(newSlowmode);
            console.log(`Updated slowmode in #${channel.name} to ${newSlowmode}s`);
        }
    } else return;
}