export interface ICommand {
    _id: string;
    name: string;
    description: string;
    help: string;
    cooldown: number;
}
