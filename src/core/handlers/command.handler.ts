import { CommandDTO, handlerDTO } from "../../dtos/command.dto";
import { ICommand } from "../../interfaces/command.inteface";
import { getUser } from "../database/functions/user";
import { Bot } from "../bot";
import { isBanned } from "../../utils/verify-ban";
import { MessageFlags } from "discord.js";
import { UserEntity } from "../../enitities/user.entity";

export class CommandHandler {
    private handlerData: handlerDTO;
    public isCommand: boolean = true;
    private command: (ICommand & {
        execute: (data: CommandDTO, ...args: any[]) => Promise<void>;
    }) | null;
    private args: (string | number | boolean | undefined)[]
    private userId: string;

    constructor(data: handlerDTO) {
        this.handlerData = data;

        const essentialData = this.messageParser();
        
        this.args = essentialData.args;
        this.userId = essentialData.userId;
        this.command = this.getCommand(essentialData.name);

        if(!this.command) this.isCommand = false;
    }

    public async run(){
        if(!this.command) return console.error('Command not found');

        const user = await getUser({ id: this.userId });
        
        if(!user) return null;
        // if(await user.getPrivilege() === "common") return null;
        
        const userBanned = await isBanned(user.json());

        if(userBanned.status){
            this.handlerData.command.reply({
                embeds: [userBanned.embed],
                flags: MessageFlags.Ephemeral | 0
            });

            return;
        }

        this.command.execute({
            command: this.handlerData.command as any,
            type: this.handlerData.type as any,
            user
        }, ...this.args);
    }

    private messageParser(){
        if(this.handlerData.type === "prefix"){
            const content = this.handlerData.command.content.toLowerCase();
            const args = content.slice(Bot.instance.prefix.length).trim().split(/ +/g);
            const userId = this.handlerData.command.author.id;
            const name = args.shift()! as string;
            
            return { name, args, userId };
        }
        
        const name = this.handlerData.command.commandName;
        const userId = this.handlerData.command.user.id;
        const args = this.handlerData.command.options.data.map(element => {
            return element.value
        });

        return { name, args, userId };
    }
    
    public getCommand(name: string){
        let command = Bot.instance.commands.get(name.toLowerCase());

        if (!command) {
            command = Bot.instance.aliases.get(name.toLowerCase());
        
            if (!command) return null;
        };

        return command;
    }
}