export interface IEvent {
    name: string;
    execute: () => Promise<void>
}