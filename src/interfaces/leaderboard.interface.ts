export interface Leaderboard {
    page: number
    users: CardUser[]
}

interface CardUser {
    id: string,
    profile: string,
    balance: string,
    color: string,
    font: string,
}