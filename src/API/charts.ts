import axios from '../axiosBenchmark';
import { AxiosResponse } from 'axios';

export class ChartsService {
    public async getEndpointRespones(id: number): Promise<AxiosResponse> {
        const chart = await axios.get('api/chartResponse/' + id + '/endpoint');
        return chart;
    }

    public async getMethodRespones(id: number): Promise<AxiosResponse> {
        const chart = await axios.get('api/chartResponse/' + id + '/method');
        return chart;
    }
}
