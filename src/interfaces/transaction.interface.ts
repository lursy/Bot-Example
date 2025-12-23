import { ITransaction } from '../core/database/interface/ITransactions';
import { IUser } from '../core/database/interface/IUser';

export type TransactionSuccess = {
    status: "success";
    failed_ids: never[];
    payer: {
        data: IUser[];
        tr: ITransaction[];
    };
    receiver: {
        data: IUser;
        tr: ITransaction[];
    };
};

export type TransactionPayerError = {
    status: "error_payer";
    failed_ids: string[]; // Lista de quem não pagou
    payer: { data: null; tr: null };
    receiver: { data: null; tr: null };
};

export type TransactionSystemError = {
    status: "error_receiver" | "error_max_retries";
    failed_ids: never[]; // Array vazio
    payer: { data: null; tr: null };
    receiver: { data: null; tr: null };
};

export type TransactionResult =
    | TransactionSuccess
    | TransactionPayerError
    | TransactionSystemError;