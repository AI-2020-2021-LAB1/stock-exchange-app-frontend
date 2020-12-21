import axios from '../axiosBenchmark';
import { AxiosResponse } from 'axios';
import { Configurations } from '../models/ConfigurationModel';
import store from '../store';

export class ConfigurationsService {
    public async getConfigurations(body: object): Promise<AxiosResponse<Configurations>> {
        const configurations = await axios.get('api/configuration', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
            params: body,
        });

        return configurations;
    }

    public async editConfigurationById(id: number, body: object): Promise<AxiosResponse> {
        const edit = await axios.patch('api/configuration/' + id, body, {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
        });
        return edit;
    }

    public async createConfiguration(body: object): Promise<AxiosResponse> {
        const create = await axios.post('api/configuration/', body, {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
        });
        return create;
    }
}
