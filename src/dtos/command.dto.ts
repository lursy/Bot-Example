import { CacheType, ChatInputCommandInteraction, Message } from "discord.js";

export type CommandDTO = {
    type: "prefix";
    command: Message;
} | {
    type: "slash";
    command: ChatInputCommandInteraction<CacheType>;
}