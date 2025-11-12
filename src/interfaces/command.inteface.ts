import { ApplicationCommandOptionData } from "discord.js";

export interface ICommand {
    name:        string;
    group:        string;
    howToUse:    string;
    cooldown:    number;
    description: string;
    options:     ApplicationCommandOptionData[];
}