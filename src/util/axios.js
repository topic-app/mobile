import axios from 'axios';
import config from '../../app.json';

console.log(config);

const instance = axios.create();
instance.defaults.baseURL = 'example.org';
instance.defaults.timeout = 20000;

export default instance;
