import { Document, Types } from "mongoose";

export interface IGuild extends Document {
    _id: Types.ObjectId
    guild_id: string;
    prefix: string | null;
    blocked_chats: {name: string, id: string}[];
}
