import axios from '../axios';
import { AxiosResponse } from 'axios';
import { Tags } from '../models/TagModel';
import store from '../store';

export class TagsService {
    public async getTags(body: object): Promise<AxiosResponse<Tags>> {
        const tags = await axios.get('api/tag', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });
        return tags;
    }

    public async deleteTag(body: object): Promise<AxiosResponse<any>> {
        const tags = await axios.delete('api/tag', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });
        return tags;
    }

}
