export interface IRace {
    author_id: string,
    status: 'open' | 'closed',
    bet_amount: number,
    max_players: number,
    created_at: number
}