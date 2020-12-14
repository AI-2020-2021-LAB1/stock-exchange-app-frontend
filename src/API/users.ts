import axios from '../axios';
import { AxiosResponse } from 'axios';
import { Users } from '../models/UserModel';
import store from '../store';

export class UsersService {
  public async getUsers(body: object): Promise<AxiosResponse<Users>> {
    const users = await axios.get('api/user', {
      headers: {
        Authorization: 'Bearer ' + store.getters.token,
      },
      params: body,
    });
    return users;
  }

  public async editUserById(id: number, body: object): Promise<AxiosResponse> {
    const edit = await axios.put('api/user/' + id, body, {
      headers: {
        Authorization: 'Bearer ' + store.getters.token,
      },
    });
    return edit;
  }
}
