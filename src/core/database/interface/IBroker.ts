import { Document, Types } from "mongoose";

export interface IBroker extends Document {
    _id: Types.ObjectId
    user_id: string;
    crypto: string;
    money: number;
    initial_money: number;
    date: number;
}
