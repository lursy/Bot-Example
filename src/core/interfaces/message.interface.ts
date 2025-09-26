import { InteractionReplyOptions, MessagePayload, MessageReplyOptions } from "discord.js";

export type IContentMessage = InteractionReplyOptions & {
    withResponse: true;
} & (string | MessagePayload | MessageReplyOptions)