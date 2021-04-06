import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';

import logger from '../logger';

async function getApiDevice() {
  let token: string | null = null;
  let canMessage: boolean = false;
  try {
    const authorizationStatus = await messaging().requestPermission();

    const { AUTHORIZED, PROVISIONAL } = messaging.AuthorizationStatus;
    canMessage = authorizationStatus === AUTHORIZED || authorizationStatus === PROVISIONAL;

    token = await messaging().getToken();
  } catch (err) {
    logger.warn('Could not get FCM token', err);
  }

  return {
    type: 'app',
    deviceId: token,
    canNotify: !!token && canMessage,
  };
}

export { crashlytics, messaging, getApiDevice };
