import { CacheType, ChatInputCommandInteraction, Message } from "discord.js";
import { UserEntity } from "../enitities/user.entity";

export type handlerDTO = {
    type: "prefix";
    command: Message;
} | {
    type: "slash";
    command: ChatInputCommandInteraction<CacheType>;
}

export type CommandDTO = handlerDTO & { user: UserEntity };