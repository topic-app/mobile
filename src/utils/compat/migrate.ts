import { Config } from '@constants';
import {
  addArticleRead,
  clearArticlesRead,
  updateArticlePrefs,
} from '@redux/actions/contentData/articles';
import { addEventRead, clearEventsRead } from '@redux/actions/contentData/events';
import updatePrefs from '@redux/actions/data/prefs';
import Store from '@redux/store';

import logger from '../logger';

export const migrateReduxDB = () => {
  const { preferences } = Store.getState();

  let currentVersion = preferences.reduxVersion;

  if (currentVersion < Config.reduxVersion || !currentVersion) {
    logger.warn(`StoreApp: Migrating Redux DB from ${currentVersion} to ${Config.reduxVersion}`);

    if (!currentVersion) {
      logger.warn('StoreApp: No current redux version, assuming version 0');
      currentVersion = 0;
    }

    if (currentVersion < 2) {
      updatePrefs({ analytics: true });
    }

    if (currentVersion < 3) {
      updatePrefs({
        completedFeedback: preferences.completedFeedback || [],
        appOpens: preferences.appOpens || 0,
      });
    }

    if (currentVersion < 5) {
      if ((preferences.fontFamily as string) === 'Roboto') {
        updatePrefs({ fontFamily: 'system' });
      }
    }

    if (currentVersion < 6) {
      const articleReadItems = Store.getState().articleData.read;
      clearArticlesRead();
      articleReadItems.forEach((r) => {
        addArticleRead(r.id, r.title, r.marked, r.date);
      });
      const eventReadItems = Store.getState().eventData.read;
      clearEventsRead();
      eventReadItems.forEach((r) => {
        addEventRead(r.id, r.title, r.marked, r.date);
      });
    }

    if (currentVersion < 7) {
      updatePrefs({ blocked: [] });
    }

    if (currentVersion < 8) {
      if (Store.getState().articleData.prefs.categories?.toString() === 'unread,all,following') {
        updateArticlePrefs({ categories: ['all', 'unread', 'following'] });
      }
    }

    // Add all migration scripts here in descending order
    updatePrefs({ reduxVersion: Config.reduxVersion });
  }
};
