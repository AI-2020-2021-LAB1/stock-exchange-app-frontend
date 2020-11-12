import axios from '../axios';
import { AxiosResponse } from 'axios';
import { Stocks } from '../models/StockModel';
import store from '../store';

export class StocksService {
    public async getStocks(body: object): Promise<AxiosResponse<Stocks>> {
        const stocks = await axios.get('api/stock', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return stocks;
    }

    public async getUserStocks(body: object): Promise<AxiosResponse<Stocks>> {
        const stocks = await axios.get('api/user/stock/owned', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return stocks;
    }
}
