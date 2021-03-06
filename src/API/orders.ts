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

  public async getUserOrdersById(id: number, body: object): Promise<AxiosResponse<Orders>> {
    const orders = await axios.get('api/user/' + id + '/order', {
      headers: {
        Authorization: 'Bearer ' + store.getters.token,
      },
      params: body,
    });

    return orders;
  }

  public async placeOrder(body: object): Promise<AxiosResponse<Orders>> {
    const order = await axios.post('api/order', body, {
      headers: {
        Authorization: 'Bearer ' + store.getters.token,
      },
    });

    return order;
  }

  public async cancelUserOrder(id: number): Promise<AxiosResponse> {
    const order = await axios.post('api/order/' + id + '/deactivation', {}, {
      headers: {
        Authorization: 'Bearer ' + store.getters.token,
      },
    });

    return order;
  }
}
