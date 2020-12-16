import axios from 'axios';

const benchmarkAxios = axios.create({
    baseURL: process.env.VUE_APP_BENCHMARK_URL,
});

export default benchmarkAxios;
