import { Drop } from "../models/drop.model";


export const create = async (value: number, time: number) => {
    let data = time + Date.now();

    return await Drop.create({
        value: value,
        date: data
    });
}

export const read = async (drop_id: string) => {
    return await Drop.findById(drop_id);
}

export const update = async (drop_id: string, user_id: string) => {
    return await Drop.findByIdAndUpdate(drop_id, {
        $addToSet: { users: user_id }
    });
}

export const del = async (drop_id: string) => {
    return await Drop.findByIdAndDelete(drop_id);
}
