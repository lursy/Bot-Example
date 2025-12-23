import { IGuild } from "../interface/IGuild";
import { Guild } from "../models/guild.model";

export const create = async (guild_id: string) => {
    return await Guild.create({ guild_id: guild_id });
}

export const read = async (guild_id: string, query: any) => {
    if (!guild_id) {
        return await Guild.findOne(...query);
    }

    return await Guild.findOne({ guild_id: guild_id });
}

export const update = async (_id: string, updateData: IGuild) => {
    return await Guild.findOneAndUpdate(
        { guild_id: _id },
        updateData
    );
}

export const del = async (id: string, guild_id: string) => {
    if (id) return await Guild.findByIdAndDelete(id);

    return await Guild.findOneAndDelete({ guild_id: guild_id });
}