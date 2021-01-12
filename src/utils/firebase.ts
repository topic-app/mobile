import analytics, { firebase } from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';

import logger from './logger';

async function getApiDevice() {
  const authorizationStatus = await messaging().requestPermission();

  const { AUTHORIZED, PROVISIONAL } = messaging.AuthorizationStatus;
  const canMessage = authorizationStatus === AUTHORIZED || authorizationStatus === PROVISIONAL;

  let token: string | null = null;
  try {
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

export { analytics, crashlytics, firebase, messaging, getApiDevice };
