import { Transactions } from "../models/transactions.model";

export const create_transactions = async (options: { user_id: string, action: string, value: number, date: number }) => {
    return await Transactions.create(options);
}

export const read_transactions = async (
    id: string,
    user_id: string,
    action: string,
    page: number = 1
) => {
    // Caso um ID seja fornecido, retorne o documento diretamente
    if (id) {
        return await Transactions.findById(id);
    }

    // Construa dinamicamente os filtros
    const filters: any = { user_id };

    if (action) {
        filters.action = action;
    }

    // Realize a consulta com um pipeline de agregação
    const pageSize = 10; // Tamanho da página
    const skip = (page - 1) * pageSize;

    const results = await Transactions.aggregate([
        { $match: filters }, // Filtros
        {
            $facet: {
                data: [
                    { $sort: { date: -1 } }, // Ordenar por data decrescente
                    { $skip: skip }, // Pular os documentos já visualizados
                    { $limit: pageSize } // Limitar ao tamanho da página
                ],
                count: [
                    { $count: "total" } // Contar o número total de documentos
                ]
            }
        }
    ]);

    // Prepare a resposta
    const transactions = results[0]?.data || [];
    const count = results[0]?.count[0]?.total || 0;

    return { transactions, count };
};

export const del_transactions = async (transaction_id: string, user_id: string) => {
    if (transaction_id) return await Transactions.findByIdAndDelete(transaction_id);

    return await Transactions.deleteMany({ user_id: user_id });
}