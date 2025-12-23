import { IEvent } from "../interfaces/event.interface";
import { Bot } from "../core/bot";

export function RegisterEvent() {
    return function <T extends IEvent & { "execute": (...args: any[]) => Promise<void> }>(constructor: new () => T) {
        const instance = new constructor();
        console.log(instance.name);
        
        Bot.instance.events.set(instance.name, instance);
    }
}