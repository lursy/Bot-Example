import { isBooster } from "../utils/verify-boost";
import { IUser } from "../core/database/interface/IUser";
import { Bot } from "../core/bot";

export class UserEntity implements IUser {
    constructor(
        public readonly _id: string,
        public readonly email: string,
        public readonly color: string,
        public readonly level: number,
        public readonly money: number,
        public readonly daily: number,
        public readonly spins: number,
        public readonly expire_vip: number,
        public readonly custom_emoji: string | null,
        public readonly sequence_daily: number,
    ) { }

    public async getEmoji() {
        const privilege = await this.getPrivilege();

        if (privilege != 'common') {
            if (this.custom_emoji) {
                return this.custom_emoji;
            }
        }

        const emojis = Bot.settings.emojis.animals;
        const index = Math.floor(Math.random() * emojis.length);

        return emojis[index];
    }

    public async getPrivilege() {
        const vip = this.expire_vip > Date.now();

        if (!vip) {
            const boost = await isBooster(this._id);

            if (!boost) {
                return 'common';
            }

            return 'booster';
        }

        return 'vip';
    }

    public json(){
        return {
            "_id": this._id,
            "email": this.email,
            "color": this.color,
            "level": this.level,
            "money": this.money,
            "daily": this.daily,
            "spins": this.spins,
            "expire_vip": this.expire_vip,
            "custom_emoji": this.custom_emoji,
            "sequence_daily": this.sequence_daily
        }
    }
}