export interface IGame {
    _id: string;
    user_id: string;
    game: string;
    played: number;
    sequence: number;
    win: number;
    lose: number;
}
