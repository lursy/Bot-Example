import { Document, Types } from "mongoose";

export interface IBan extends Document {
    _id: Types.ObjectId;
    user_id: string;
    author: string;
    reason: string;
    date: number;
}
