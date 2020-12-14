import axios from '../axiosBenchmark';
import { AxiosResponse } from 'axios';
import { Configurations } from '../models/ConfigurationModel';
import store from '../store';

export class ConfigurationsService {
    public async getConfigurations(): Promise<AxiosResponse<Configurations>> {
        const configurations = await axios.get('api/configuration', {
            headers: {
                Authorization: 'Bearer ' + store.getters.token,
            },
        });

        return configurations;
    }
}
