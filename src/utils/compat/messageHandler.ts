import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Linking, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import parseUrl from 'url-parse';

import { updateToken } from '@redux/actions/data/profile';
import { logger, messaging } from '@utils';

// handleMessage is called both for foreground, background and quit notifications
const handleMessage = async (remoteMessage: any) => {
  // (This is async to allow rn-firebase to run it in the background)
  if (remoteMessage?.data?.type === 'notification') {
    const { priority, message } = remoteMessage.data;
    const push = JSON.parse(message);
    if (!push) {
      logger.warn('Notification push data was empty');
      return;
    }
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: push.channel?.id || 'default',
          channelName: push.channel?.name || 'Autres',
          playSound: priority === 'urgent' || priority === 'high' || priority === 'medium',
        },
        (created) => {
          logger.info(created ? `Created channel, sending notification` : 'Sending notification');
          try {
            PushNotification.localNotification({
              channelId: push.channel?.id,
              title: push.title,
              message: push.content,
              actions: push.actions?.map((a: { text: string }) => a?.text),
              userInfo: { onPress: push.onPress, actions: push.actions },
              invokeApp: false,
            });
          } catch (err) {
            logger.warn('Failed to notify');
            logger.warn(err);
          }
        },
      );
    } else if (Platform.OS === 'ios') {
      logger.info('Sending notification');
      PushNotification.localNotification({
        category: push.channel?.id,
        title: push.title,
        message: push.message,
        playSound: priority === 'urgent' || priority === 'high' || priority === 'medium',
      });
    }
  }
};

const onNotification = (notification: any) => {
  console.log('ON NOTIF');
  console.log(notification);
  if (notification.userInteraction) {
    let action: { data: string; type: string } | undefined;
    const info = notification.data || JSON.parse(notification.userInfo);
    if (notification.action) {
      action = info?.actions?.find(
        (a: { text: string; action: { type: string; data: string } }) =>
          a.text === notification.action,
      )?.action;
    } else {
      action = info?.onPress;
    }
    if (!action) {
      logger.warn('No action on notification');
      return;
    }
    if (action.type === 'link') {
      const { pathname, query } = parseUrl(action.data);
      // Trying to get navigation to work here is to complicated, hopefully this'll work well enough
      if (Linking.canOpenURL(`topic://${pathname}${query}`)) {
        Linking.openURL(`topic://${pathname}${query}`);
      } else {
        logger.info('Could not open topic:// link, falling back to http');
        Linking.openURL(action.data);
      }
    }
  }

  notification.finish?.(PushNotificationIOS.FetchResult.NoData);
};

const setUpMessagingLoaded = () => {
  if (Platform.OS !== 'web' && messaging) {
    messaging().getToken().then(updateToken);
    messaging().onTokenRefresh(updateToken);

    messaging().onMessage(handleMessage);
  }
};

const setUpMessagingInitial = () => {
  if (Platform.OS !== 'web' && messaging) {
    messaging().setBackgroundMessageHandler(handleMessage);
    PushNotification.configure({
      onNotification,
      onAction: onNotification,

      requestPermissions: false,
    });
  }
};

export { setUpMessagingLoaded, setUpMessagingInitial };
