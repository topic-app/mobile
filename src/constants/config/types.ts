import {
  Account,
  ArticleListItem,
  ArticlePrefs,
  ArticleQuickItem,
  Department,
  EventListItem,
  EventPrefs,
  EventQuickItem,
  Preferences,
  School,
} from '@ts/types';
import { LogLevel } from '@utils/logger';
import { DeepPartial } from 'redux';

export type AppConfig = {
  logger: {
    level: LogLevel;
    exclude: LogLevel[];
  };
  dev: {
    hideSvg: boolean;
    disablePersist: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  cdn: {
    baseUrl: string;
    timeout: number;
    image: {
      defaultSize: string;
    };
  };
  maps: {
    baseUrl: string;
  };
  links: {
    privacy: string;
    conditions: string;
    mentions: string;
    share: string;
    administrator: string;
  };
  content: {
    allowedSites: { url: string; allowSubdomains: boolean }[];
    comments: {
      maxCharacters: number;
    };
  };
  auth: {
    salt: string;
    iterations: number;
    digest: 'SHA1' | 'SHA224' | 'SHA256' | 'SHA384' | 'SHA512';
    digestWeb: 'SHA-1' | 'SHA-224' | 'SHA-256' | 'SHA-384' | 'SHA-512';
    keylen: number;
  };
  defaults: {
    preferences: Preferences;
    articles: {
      lists: ArticleListItem[];
      quicks: ArticleQuickItem[];
      prefs: ArticlePrefs;
    };
    events: {
      lists: EventListItem[];
      quicks: EventQuickItem[];
      prefs: EventPrefs;
    };
    // TODO: Improve location type here
    location: {
      selected: boolean;
      global: boolean;
      type: string;
      schools: string[];
      schoolData: School[];
      departments: string[];
      departmentData: Department[];
    };
    account: Account;
  };
};

export type DevAppConfig = DeepPartial<AppConfig>;
