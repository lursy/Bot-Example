import { ICommand } from "../interface/ICommand";
import { Command } from "../models/command.model";


export const create = async (name: string, description: string, help: string, cooldown: number = 1000) => {
    return await Command.create({
        name: name,
        description: description,
        help: help,
        cooldown: cooldown,
    });
}

export const read = async (id: string, name: string) => {
    if (!id) {
        if (!name) return await Command.find({});

        return await Command.findOne({ name: name });
    }
    return await Command.findById(id);
}

export const update = async (name: string, data: ICommand) => {
    return await Command.findOneAndUpdate(
        { name: name },
        data
    );
}

export const del = async (id: string, name: string) => {
    if (!id) return await Command.deleteOne({ name: name });

    return await Command.findByIdAndDelete(id);
}

