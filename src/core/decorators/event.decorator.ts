import { bot } from "../../main";
import { IEvent } from "../interfaces/event.interface";


export function RegisterEvent() {
    return function <T extends IEvent & { "execute": () => Promise<void> }>(constructor: new (...args: any[]) => T) {
        const instance = new constructor();
        
        bot.events.set(instance.name, instance);
    };
}