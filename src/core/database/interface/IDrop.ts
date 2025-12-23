import { Document, Types } from "mongoose";

export interface IDrop extends Document {
    _id: Types.ObjectId;
    value: number;
    date: number;
    users: string[];
}
