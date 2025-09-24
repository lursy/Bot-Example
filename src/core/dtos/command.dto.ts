import { CacheType, ChatInputCommandInteraction, Message } from "discord.js";

export type CommandHandlerDTO = {
    type: "prefix";
    message: Message;
} | {
    type: "slash";
    interaction: ChatInputCommandInteraction<CacheType>;
}