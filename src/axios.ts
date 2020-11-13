import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_BACK_URL;
// axios.defaults.baseURL = 'http://193.33.111.196:8000/';

export default axios;
