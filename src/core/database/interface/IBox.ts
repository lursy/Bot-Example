import { Document, Types } from "mongoose";

export interface IBox extends Document {
   _id: Types.ObjectId
    date: number;
    max_users: number;
    rarity: "normal" | "silver" | "gold" | "diamond" | "mystic"; // Raridade da caixa
    gift: {
        expire_vip?: number; 
        money?: number;
        spins?: number;
    };
}

export interface IBoxGroup extends Document {
   _id: Types.ObjectId
    boxes: {
        box_id: Types.ObjectId,
        chosen_count: number
    }[];
}

export interface IUserChoice extends Document {
   _id: Types.ObjectId
    user_id: string;
    box_id: string;
    box_group_id: string;
    chosen_at: number;
}
