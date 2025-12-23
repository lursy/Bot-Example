import { unabbreviate } from "util-stunks";

export function valueParser(value: string, balance: number = 0) {
    if (['max', 'all', 'tudo'].includes(value)) {
        return balance;
    }

    if (['metade', 'half'].includes(value)) {
        return Math.floor(balance / 2);
    }

    if (['sobras', 'sobra'].includes(value)) {
        let money_str = balance.toString()

        return Math.floor(Number(money_str.slice(money_str.length > 1 ? money_str.length > 2 ? 2 : 1 : 0)));
    }

    value = value.replace("kk", "m");
    return Math.floor(unabbreviate(value));
}