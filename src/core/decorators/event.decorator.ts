import { IEvent } from "../interfaces/event.interface";
import { bot } from "../../main";


export function RegisterEvent() {
    return function <T extends IEvent & { "execute": (...args: any[]) => Promise<void> }>(constructor: new () => T) {
        const instance = new constructor();
        
        bot.events.set(instance.name, instance);
    }
}