import { Schema, model } from "mongoose";
import { IUser } from "../interface/IUser";

const UserSchema: Schema = new Schema({
        _id: { type: String, unique: true, required: true },
        email: { type: String, dafault: null},
        level: { type: Number, default: 0 },
        money: { type: Number, default: 0 },
        daily: { type: Number, default: 0 },
        spins: { type: Number, default: 0 },
        actions: { type: Number, default: 0 },
        color: { type: String, default: 'white' },
        expire_vip: {type: Number, default: 0},
        custom_emoji: { type: String, default: null },
        custom_call: { type: String, default: null },
        custom_role: { type: String, default: null },
        sequence_daily: { type: Number, default: 0 },
    }, {
    versionKey: false,
    autoIndex: false
});


export const User = model<IUser>('User', UserSchema);

