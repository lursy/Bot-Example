import { Schema, model } from "mongoose";
import { ITokens } from "../interface/ITokens";

const tokensScema: Schema = new Schema({
    token: {type: String, unique: true}
}, {
    versionKey: false,
    capped: { capped: true, size: 3200, max: 50 }
})


export const Tokens = model<ITokens>('Tokens', tokensScema);