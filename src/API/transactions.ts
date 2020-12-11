import axios from '../axios';
import { AxiosResponse } from 'axios';
import { Transactions } from '../models/TransactionModel';
import store from '../store';

export class TransactionsService {
    public async getTransactions(body: object): Promise<AxiosResponse<Transactions>> {
        const transactions = await axios.get('api/user/transaction/owned', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return transactions;
    }

    public async getUserTransactionsById(id: number, body: object): Promise<AxiosResponse<Transactions>> {
        const transactions = await axios.get('api/user/' + id + '/transaction', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return transactions;
    }
}
