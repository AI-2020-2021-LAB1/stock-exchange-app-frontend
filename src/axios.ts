import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_BACK_URL || 'http://127.0.0.1:8081/';

export default axios;
