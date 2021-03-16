import axios from 'axios';

import { Config } from '@constants';

const instance = axios.create({
  baseURL: Config.api.url.base,
  timeout: Config.api.timeout,
});

export default instance;
