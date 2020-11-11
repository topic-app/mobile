/**
 * Dev config for the app, used to tweak config variables without
 * adding changes to git or changing production builds
 */

import { DevAppConfig } from './types';

const config: DevAppConfig = {
  logger: {
    level: 'debug',
    exclude: ['http'],
  },
  api: {
    timeout: 3000,
  },
  cdn: {
    timeout: 3000,
  },
};

export default config;
