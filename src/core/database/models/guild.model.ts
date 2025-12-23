import { Schema, model } from "mongoose";
import { IGuild } from "../interface/IGuild";

const GuildSchema: Schema = new Schema({
    guild_id: { type: String, unique: true, required: true },
    blocked_chats: { type: Array, default: [] },
    prefix: { type: String, maxlength: 5, default: null }
});


export const Guild = model<IGuild>('Guild', GuildSchema);

