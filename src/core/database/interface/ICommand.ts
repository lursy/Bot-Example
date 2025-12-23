import { Document, Types } from "mongoose";

export interface ICommand extends Document {
   _id: Types.ObjectId
    name: string;
    description: string;
    help: string;
    cooldown: number;
}
