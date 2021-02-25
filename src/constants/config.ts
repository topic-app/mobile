import _ from 'lodash';

import defaultConfig from './config/default';
import devConfig from './config/dev';

const config = __DEV__ ? _.merge(defaultConfig, devConfig) : defaultConfig;

export default config;
