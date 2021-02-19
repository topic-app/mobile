/**
 * Dev config for the app, used to tweak config variables without
 * adding changes to git or changing production builds
 * Dev config is merged with default config with lodash's merge function
 * meaning objects and arrays are merged
 */
import { DevAppConfig } from './types';

const config: DevAppConfig = {
  logger: {
    level: 'verbose',
    exclude: [],
  },
  api: {
    timeout: 3000,
    // Enable if working on web and have nginx setup
    // url: {
    // base: 'http://localhost/api/api/v1',
    // auth: 'http://localhost/api/auth/v1',
    // data: 'http://localhost/api/api/v1',
    // },
  },
  cdn: {
    timeout: 3000,
  },
  dev: {
    webAllowAnonymous: true,
  },
};

export default config;
