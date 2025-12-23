import { Schema, model } from "mongoose";
import { IIp } from "../interface/IIp";

const IPSchema: Schema = new Schema({
        user_id: { type: String, required: true },
        ip: { type: String, required: true },
});

IPSchema.index({ user_id: 1, ip: 1 }, { unique: true });

export const IP = model<IIp>('IP', IPSchema);
