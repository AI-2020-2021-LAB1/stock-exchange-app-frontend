import axios from '../axios';
import { Stocks } from '../models/StockModel';
import store from '../store';

export class StocksService {
    public async getStocks(body: object): Promise<any> {
        const stocks = await axios.get('api/stock', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return stocks;
    }
}
