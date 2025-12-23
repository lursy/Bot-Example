process.stdout.write('\x1bc');

import { ShardingManager } from "discord.js";
import { config } from "dotenv";
import path from "path";
config();

const botFile = path.join(__dirname, 'core/bot.ts');

async function main() {
    try {
        const manager = new ShardingManager(botFile, {
            token: process.env.TOKEN,
            totalShards: 'auto',
            respawn: true,
            execArgv: ['-r', require.resolve('ts-node/register')] 
        });
        
        manager.on('shardCreate', async (shard) => {
            console.log(`[Manager] 🔹 Shard ${shard.id} iniciada.`);

            shard.on("death", () => console.log(`[Manager] 🔴 Shard ${shard.id} morreu.`));
            shard.on("disconnect", () => console.log(`[Manager] 🔸 Shard ${shard.id} desconectada.`));
            shard.on("reconnecting", () => console.log(`[Manager] 🔄 Shard ${shard.id} reconectando...`));
        });
        
        const shards = await manager.spawn();
        console.log(`[Shard spawn] - ${shards.size}`);
    } catch (err) {
        if(err instanceof Error){
            console.error("Unexpected error:", err);
        }
    }
}

main();