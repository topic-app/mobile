import axios from 'axios';
import { config } from '@root/app.json';

const instance = axios.create({
  baseURL: config.api.url,
  timeout: 10000,
});

export default instance;
