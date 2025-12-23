import { Document } from "mongoose";


export interface ITokens extends Document{
    token: string
}