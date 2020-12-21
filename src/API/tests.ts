import axios from '../axiosBenchmark';
import { AxiosResponse } from 'axios';
import { Tests } from '../models/TestModel';

export class TestsService {
    public async startTest(body: object): Promise<AxiosResponse> {
        const test = await axios.post('api/test/', body);
        return test;
    }

    public async getTestStatus(): Promise<AxiosResponse> {
        const test = await axios.get('api/test/progress');
        return test;
    }

    public async getTests(body: object): Promise<AxiosResponse<Tests>> {
        const tests = await axios.get('api/test', {
            params: body,
        });

        return tests;
    }
}
