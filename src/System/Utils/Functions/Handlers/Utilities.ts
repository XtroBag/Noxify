import { Mongoose, UpdateResult } from "mongoose";
import { DiscordClient } from "./DiscordClient.js";
import Logger from "./Logger.js";
import { Server } from "../../../Schemas/Models/Models.js";
import { ServerData } from "../../../Types/Database.js";
import mongoose from "mongoose";
import axios from "axios";

export class Utilities {
  public client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  async registerDatabase(): Promise<Mongoose | void> {
    try {
      Logger.log("Successfully connected to MongoDB!");
      return await mongoose.connect(process.env.MONGOOSE_URI, {
        dbName: "Noxify",
        autoCreate: true,
      });
    } catch (error) {
      Logger.error("Database connection failed", error);
      throw error;
    }
  }

  async uploadPaste(content: string, language: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.pastes.dev/post',
        content,
        {
          headers: {
            'Content-Type': `text/${language}`,   // e.g., text/javascript
            'User-Agent': 'Noxify'
          }
        }
      );
  
      const key = response.data?.key // || response.headers['location']?.split('/').pop();
      if (!key) console.error('Paste key not found in response.');
  
      return `https://pastes.dev/${key}`;
    } catch (error) {
      console.error('Failed to upload paste:', error);
      throw error;
    }
  }

  async getGuild(guildId: string): Promise<ServerData> {
    return await Server.findOne({ guildID: guildId });
  }


  async autoSlowmodeToggle({ guildID, toggle }: { guildID: string, toggle: boolean }) {
   return await Server.updateOne(
      { guildID: guildID },
      { $set: { "autoSlowmode.enabled": toggle } }
    );

  }

  async autoSlowmodeSetTimes({ guildID, shortest, moderate, highest }: { guildID: string, shortest?: number, moderate?: number, highest?: number }) {
    const updateFields: Record<string, number> = {};
  
    if (shortest !== null) updateFields['autoSlowmode.shortestTime'] = shortest;
    if (moderate !== null) updateFields['autoSlowmode.moderateTime'] = moderate;
    if (highest !== null) updateFields['autoSlowmode.highestTime'] = highest;
  
    if (Object.keys(updateFields).length === 0) {
      Logger.warn(`No valid slowmode values provided for update in guild: ${guildID}. At least one of 'shortest', 'moderate', or 'highest' should be specified.`);
      return null;
    }
  
    return await Server.updateOne(
      { guildID },
      { $set: updateFields }
    );
  }

  async autoSlowmodeSetChannels({ guildID, channels }: { guildID: string, channels: string[] }) {
    return await Server.findOneAndUpdate(
      { guildID: guildID },
      { $set: { "autoSlowmode.channels": channels } }
    );
  }

}
