import axios from 'axios';

const mainAxios = axios.create({
    baseURL: process.env.VUE_APP_BACK_URL,
});

export default mainAxios;
