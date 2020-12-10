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

import { AppConfig } from './types';

const defaultConfig: AppConfig = {
  api: {
    baseUrl: 'https://api.topicapp.fr/v1',
    timeout: 10000,
  },
  links: {
    privacy: 'https://topicapp.fr/legal/confidentialite',
    conditions: 'https://topicapp.fr/legal/conditions',
    mentions: 'https://topicapp.fr/legal/mentions',
    share: 'https://go.topicapp.fr/',
    administrator: 'https://topicapp.fr/legal/administrateurs',
  },
  cdn: {
    baseUrl: 'https://cdn.topicapp.fr/file/get/',
    timeout: 10000,
    image: {
      defaultSize: 'small',
    },
  },
  content: {
    allowedSites: [
      { url: 'https://topicapp.fr/', allowSubdomains: true },
      { url: 'https://gitlab.com/', allowSubdomains: true },
    ],
    comments: {
      maxCharacters: 500,
    },
  },
  maps: {
    baseUrl: 'https://maps.topicapp.fr/',
  },
  defaults: {
    account: {
      loggedIn: false,
      permissions: [],
      accountInfo: null,
      creationData: {},
    },
    location: {
      selected: false,
      schools: [],
      schoolData: [],
      departments: [],
      departmentData: [],
      global: false,
    },
    preferences: {
      theme: 'light',
      useSystemTheme: true,
      history: true,
      recommendations: false,
      syncHistory: true,
      syncLists: true,
      fontSize: 14,
      fontFamily: 'Roboto',
      stripFormatting: false,
      themeEasterEggDiscovered: false,
    },
    articles: {
      lists: [
        {
          id: '0',
          name: 'Favoris',
          icon: 'star-outline',
          items: [],
        },
        {
          id: '1',
          name: 'À lire plus tard',
          icon: 'history',
          items: [],
        },
      ],
      quicks: [],
      prefs: {
        categories: ['unread', 'all', 'following'],
        hidden: [],
      },
    },
    events: {
      lists: [
        {
          id: '0',
          name: 'Favoris',
          icon: 'star-outline',
          items: [],
        },
      ],
      quicks: [],
      prefs: {
        categories: ['upcoming', 'passed', 'following'],
        hidden: [],
      },
    },
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
  dev: {
    hideSvg: false,
    disablePersist: false,
  },
};

export default defaultConfig;
