import { UserEntity } from "../../../enitities/user.entity";
import { IUser } from "../interface/IUser";
import { IP } from "../models/ip.model";
import { User } from "../models/user.model";
import { createHash } from "crypto";

export const create_user = async (options: { id: string }) => {
    return await User.create({
        _id: options.id
    });
}

export function getUser(options: { id?: undefined; query?: any }): Promise<UserEntity[]> | Promise<null>;
export function getUser(options: { id?: string; query?: any | undefined }): Promise<UserEntity> | Promise<null>;
export async function getUser(options: { id?: string, query?: any }) {
    const { id, query } = options;

    if(!id && !query){
        return null;
    }

    if (id) {
        let user = await User.findById(id);
        
        if (!user) {
            user = await create_user({ id });
        }

        if(user){
            return new UserEntity(
                user._id,
                user.email,
                user.color,
                user.level,
                user.money,
                user.daily,
                user.spins,
                user.expire_vip,
                user.custom_emoji,
                user.sequence_daily
            );
        }

        return null;
    }

    const usersDb = await User.find(query);

    const users = usersDb.map(u => {
        return new UserEntity(
           u._id,
           u.email,
           u.color,
           u.level,
           u.money,
           u.daily,
           u.spins,
           u.expire_vip,
           u.custom_emoji,
           u.sequence_daily
       );
    });

    return users;
}

export const get_top = async (page: number = 1) => {
    return await User.find({}, 'money name image', { sort: { 'money': -1 } }).limit(5).skip(5 * (page - 1));
}

export const update = async (user_id: string, updateData: any) => {

    if (updateData.ip) {
        const hash = createHash('sha256');
        const ip_hash = hash.update(updateData.ip).digest('hex');

        IP.findOneAndUpdate(
            { user_id: user_id, ip: ip_hash },
            { $setOnInsert: { user_id: user_id, ip: ip_hash } },
            { upsert: true, new: true }
        );

        delete updateData.ip;
    }

    return await User.findByIdAndUpdate(
        user_id,
        updateData
    );
}

export const del_user = async (user_id: string) => {
    return await User.findByIdAndDelete(user_id);
}

export const vip = async (id: string, time: number) => {
    const user = await getUser({ id: id });
    const date = Date.now();

    if (user) {
        const dataUser = user.json();

        if (time == 0) {
            dataUser.expire_vip = 0;

            update(id, dataUser);
        } if (dataUser.expire_vip > date) {
            time += dataUser.expire_vip;
        } else {
            time += Date.now();
        }
    }

    return await User.findByIdAndUpdate(id, { expire_vip: time });
}

export const get_rank = async (id: string) => {
    let allUsers = await User.find({
        'money': { $gt: 0 }
    },
        'money', {
        sort: {
            'money': -1
        }
    });

    let rank = allUsers.findIndex(x => x._id === id) + 1

    if (!rank) {
        rank = await User.countDocuments();
    }

    return rank;
}