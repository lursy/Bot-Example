import { readFileSync } from "fs";
import Redis from "ioredis";

const redisClient = new Redis({
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASS!,
    username: process.env.REDIS_USER!,
    tls: {
        ca: readFileSync('./certificates/ca-certificate.crt'),
        cert: readFileSync('./certificates/certificate.pem'),
        key: readFileSync('./certificates/private-key.key'),
        rejectUnauthorized: true
    }
});

redisClient.defineCommand('joinRace', {
    numberOfKeys: 1,
    lua: `
        local metaKey = KEYS[1]
        local participantsKey = metaKey .. ":participants"
        
        local userId = ARGV[1]
        local userEmoji = ARGV[2]

        -- Busca metadados
        local meta = redis.call('HMGET', metaKey, 'status', 'max_players')
        local status = meta[1]
        local maxPlayers = tonumber(meta[2])

        -- Validações
        if not status then return "race_not_found" end
        if status ~= 'open' then return "race_closed" end
        
        if redis.call('HEXISTS', participantsKey, userId) == 1 then return "already_participating" end

        local currentCount = redis.call('HLEN', participantsKey)
        if maxPlayers and currentCount >= maxPlayers then return "participants_exceded" end

        -- Adiciona usuário
        redis.call('HSET', participantsKey, userId, userEmoji)
        
        -- === LÓGICA DE TTL (ATUALIZADA) ===
        local ttl = redis.call('TTL', metaKey)
        
        -- TTL -1 significa que a chave existe mas não tem expiração definida
        -- TTL -2 significa que a chave não existe (já tratamos no check de status)
        
        if ttl <= 0 then
            -- Se a corrida não tem tempo definido, definimos 90s para ambas por segurança
            redis.call('EXPIRE', metaKey, 90)
            redis.call('EXPIRE', participantsKey, 90)
        else
            -- Se a corrida já tem um cronômetro rodando, a lista de participantes segue o mestre
            redis.call('EXPIRE', participantsKey, ttl)
        end

        return "ok"
    `
});

declare module "ioredis" {
    interface RedisCommander {
        joinRace(metaKey: string, userId: string, emoji: string): Promise<"ok" | "already_participating" | "race_closed" | "race_not_found">;
    }
}

export const redis = redisClient;

redis.on('connect', () => console.log('[Redis] Conectado!'));
redis.on('error', (err) => console.error('[Redis] Erro:', err));