import axios from '../axios';
import { AxiosResponse } from 'axios';
import { Orders } from '../models/OrderModel';
import store from '../store';

export class OrdersService {
    public async getOrders(body: object): Promise<AxiosResponse<Orders>> {
        const orders = await axios.get('api/order', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return orders;
    }

    public async getUserOrders(body: object): Promise<AxiosResponse<Orders>> {
        const orders = await axios.get('api/user/order/owned', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return orders;
    }
}
