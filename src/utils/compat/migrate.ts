import { Config } from '@constants';
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

    // Add all migration scripts here in descending order
    updatePrefs({ reduxVersion: Config.reduxVersion });
  }
};
