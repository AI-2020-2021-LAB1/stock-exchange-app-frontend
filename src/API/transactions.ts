import axios from '../axios';
import { AxiosResponse } from 'axios';
import { Transactions } from '../models/TransactionModel';
import store from '../store';

export class TransactionsService {
    public async getTransactions(body: object): Promise<AxiosResponse<Transactions>> {
        const transactions = await axios.get('api/transaction', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return transactions;
    }
}
