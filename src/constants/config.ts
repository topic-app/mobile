import _ from 'lodash';
import devConfig from './config/dev';
import defaultConfig from './config/default';

const config = __DEV__ ? _.merge(defaultConfig, devConfig) : defaultConfig;

export default config;
