/**
 * This file is the default config for the application.
 * It is merged with ./dev.ts at runtime when developping the app.
 * In production builds, ./dev.ts is NOT merged and the config is entirely
 * based on this file.
 * To add a property to the app config:
 * - Add it to the Config type in ./types.ts
 * - Add it to the defaultConfig variable
 * For quick changes without pushing to git, change ./dev.ts
 * e.g. Adding a default account should be done in ./dev.ts because
 *      - Pushing the account requires you to manually add it to git
 *      - The account won't be used in production builds
 */
import { Platform } from 'react-native';

import { AppConfig } from './types';

const defaultConfig: AppConfig = {
  api: {
    url: {
      base: 'https://api.topicapp.fr/v1',
      auth: 'https://auth.topicapp.fr/v1',
      data: 'https://data.topicapp.fr/v1',
    },
    devUrl: {
      base: 'https://api-dev.topicapp.fr/v1',
      auth: 'https://auth-dev.topicapp.fr/v1',
      data: 'https://data-dev.topicapp.fr/v1',
    },
    timeout: 10000,
  },
  links: {
    privacy: 'https://topicapp.fr/legal/confidentialite',
    conditions: 'https://topicapp.fr/legal/conditions',
    mentions: 'https://topicapp.fr/legal/mentions',
    share: 'https://go.topicapp.fr',
    administrator: 'https://topicapp.fr/legal/administrateurs',
  },
  cdn: {
    baseUrl: 'https://cdn-dev.topicapp.fr/file/get/',
    uploadUrl: 'https://cdn-dev.topicapp.fr/file/upload',
    timeout: 10000,
    image: {
      defaultSize: 'small',
    },
  },
  content: {
    allowedSites: [{ url: 'https://topicapp.fr/', allowSubdomains: true }],
    comments: {
      maxCharacters: 500,
    },
  },
  maps: {
    baseUrl: 'https://maps.topicapp.fr/',
  },
  seedDb: {
    account: {},
    location: {},
    preferences: {},
    articles: {},
    events: {},
  },
  google: {
    youtubeKey: Platform.select({
      android: 'AIzaSyBBO3lF1vPmpCc61mU9liYQ3zGPup9MRFA',
      ios: 'AIzaSyCgdAPkn7cA0PrFUr9bdvG-6il_orO-djs',
      default: '',
    }),
    youtubePlaceholder: 'https://cdn.topicapp.fr/file/get/5fb3acd117cbef001862f725#',
  },
  auth: {
    salt:
      'EFoZlnQ9WDYLff8Qnq1QWiVe1Wzf7HjK6uQ2goshuFPFZuQj5gQXTcjhPvEsITAjpsfaYTdJDpnLaW/nKoYDm3FB2kLo0+lzS9gI9271dUnzvy5DZOetP/YMNDn++ApJrsQMeTNJEOIKJ2rLMfx8VaT241Hzvhy80sjWClzHZW0=',
    iterations: 10000,
    digest: 'SHA512',
    digestWeb: 'SHA-512',
    keylen: 32,
  },
  logger: {
    level: 'warning',
    exclude: [],
  },
  recommendations: {
    values: {
      read: {
        groups: 1,
        users: 1,
        tags: 1,
      },
      list: {
        groups: 5,
        users: 5,
        tags: 5,
      },
      comment: {
        groups: 2,
        users: 2,
        tags: 2,
      },
      mark: {
        groups: -1,
        users: -1,
        tags: -1,
      },
    },
  },
  dev: {
    hideSvg: false,
    disablePersist: false,
    webAllowAnonymous: false,
  },
  layout: {
    dualMinWidth: 1000,
  },
  reduxVersion: 7,
};

export default defaultConfig;
