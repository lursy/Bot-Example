import { Document } from "mongoose"

export interface IUser {
    _id: string,
    email: string,
    color: string,
    level: number,
    money: number,
    daily: number,
    spins: number,
    expire_vip: number,
    custom_emoji: string | null,
    sequence_daily: number,
}