import axios from 'axios';
import { config } from '../../app.json';

const instance = axios.create();
instance.defaults.baseURL = config.api.url;
instance.defaults.timeout = 10000;

export default instance;