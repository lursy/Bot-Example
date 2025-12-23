import { Document, Types } from "mongoose";

export interface IIp extends Document {
    _id: Types.ObjectId
    user_id: string;
    ip: string;
}
