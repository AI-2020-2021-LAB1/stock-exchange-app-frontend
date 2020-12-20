import axios from '../axiosBenchmark';
import { AxiosResponse } from 'axios';

export class ChartsService {
    public async getEndpointRespones(): Promise<AxiosResponse> {
        const chart = await axios.post('api/chartResponse/endpoint');
        return chart;
    }

    public async getMethodRespones(): Promise<AxiosResponse> {
        const chart = await axios.get('api/chartResponse/method');
        return chart;
    }
}
