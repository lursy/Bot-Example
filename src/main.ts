import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./core/bot";

export const bot = new Bot(
    new Client({
        intents: [
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.Guilds
        ],
        sweepers: {
            messages: {
                interval: 60,
                lifetime: 600
            }
        }
    })
)