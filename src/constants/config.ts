import devConfig from './config/dev';
import defaultConfig from './config/default';

const config = __DEV__ ? Object.assign(defaultConfig, devConfig) : defaultConfig;

export default config;
