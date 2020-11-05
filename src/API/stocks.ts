import axios from '../axios';
import { Stocks } from '../models/StockModel';
import store from '../store';

export class StocksService {
    public static async getStocks(
        page: number,
        abbreviation?: string,
        amount?: number,
        amountLessThan?: number,
        amountGreaterThan?: number,
        currentPrice?: number,
        currentPriceLessThan?: number,
        currentPriceGreaterThan?: number,
        name?: string,
        size?: number,
        sort?: string[],
    ): Promise<Stocks> {
        return (await axios('api/stock/', {
            params: {
                page,
                abbreviation: abbreviation ? abbreviation : null,
                amount: amount ? amount : null,
                amountLessThan: amountLessThan ? amountLessThan : null,
                amountGreaterThan: amountGreaterThan ? amountGreaterThan : null,
                currentPrice: currentPrice ? currentPrice : null,
                currentPriceLessThan: currentPriceLessThan ? currentPriceLessThan : null,
                currentPriceGreaterThan: currentPriceGreaterThan ? currentPriceGreaterThan : null,
                name: name ? name : null,
                size: size ? size : null,
                sort: sort ? sort : null,
            },
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
        })).data;
    }
}
