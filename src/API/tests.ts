import axios from '../axiosBenchmark';
import { AxiosResponse } from 'axios';
import store from '../store';

export class TestsService {
    public async startTest(body: object): Promise<AxiosResponse> {
        const test = await axios.post('api/test/', body, {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
        });
        return test;
    }

    public async getTestStatus(): Promise<AxiosResponse> {
        const test = await axios.get('api/test/progress');
        return test;
    }
}
