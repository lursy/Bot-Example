import { Bot } from "./core/bot";
import "./loader";

function main() {
    process.stdout.write('\x1bc');
    Bot.instance.start();
}

main();