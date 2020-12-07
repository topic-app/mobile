import { DeepPartial } from 'redux';

import { AccountState, ArticlesState, EventsState, LocationList, Preferences } from '@ts/types';
import { LogLevel } from '@utils/logger';

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
    devUrl: string;
    timeout: number;
  };
  google: {
    youtubeKey: string;
    youtubePlaceholder: string;
  };
  cdn: {
    baseUrl: string;
    uploadUrl: string;
    timeout: number;
    image: {
      defaultSize: string;
    };
  };
  layout: {
    dualMinWidth: number;
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
  seedDb: {
    preferences: Partial<Preferences>;
    articles: Partial<ArticlesState>;
    events: Partial<EventsState>;
    location: Partial<LocationList>;
    account: Omit<AccountState, 'state'> | {};
  };
};

export type DevAppConfig = DeepPartial<AppConfig>;
