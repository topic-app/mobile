import axios from 'axios';
import { config } from '../../app.json';

console.log(config);

const instance = axios.create();
instance.defaults.baseURL = config.api.url;
instance.defaults.timeout = 10000;

export default instance;
