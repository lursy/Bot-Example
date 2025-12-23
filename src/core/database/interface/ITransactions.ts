import { Document, Types } from "mongoose";

export interface ITransaction extends Document {
    _id: Types.ObjectId
    user_id: string;
    author: string;
    action: string;
    value: number;
    date: number;
}
