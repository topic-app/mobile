import firebaseCrashlytics from '@react-native-firebase/crashlytics';
import firebaseMessaging from '@react-native-firebase/messaging';

import logger from '../logger';

async function getApiDevice() {
  let token: string | null = null;
  let canMessage: boolean = false;
  try {
    const authorizationStatus = await firebaseMessaging().requestPermission();

    const { AUTHORIZED, PROVISIONAL } = firebaseMessaging.AuthorizationStatus;
    canMessage = authorizationStatus === AUTHORIZED || authorizationStatus === PROVISIONAL;

    token = await firebaseMessaging().getToken();
  } catch (err) {
    logger.warn('Could not get FCM token', err);
  }

  return {
    type: 'app',
    token,
    canNotify: !!token && canMessage,
  };
}

const crashlytics: typeof firebaseCrashlytics | null = firebaseCrashlytics;
const messaging: typeof firebaseMessaging | null = firebaseMessaging;

export { crashlytics, messaging, getApiDevice };
