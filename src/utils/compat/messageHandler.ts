import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Linking, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import parseUrl from 'url-parse';

import { updateToken } from '@redux/actions/data/profile';
import { logger, messaging } from '@utils';

const handleMessage = async (remoteMessage: any) => {
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
          logger.info({
            channelId: push.channel?.id,
            title: push.title,
            message: push.content,
            color: 'primary',
            actions: push.actions?.map((a: { text: string }) => a?.text),
            userInfo: { onPress: push.onPress, actions: push.actions },
          });
          try {
            PushNotification.localNotification({
              channelId: push.channel?.id,
              title: push.title,
              message: push.content,
              actions: push.actions?.map((a: { text: string }) => a?.text),
              userInfo: { onPress: push.onPress, actions: push.actions },
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

const setUpMessaging = () => {
  if (Platform.OS !== 'web' && messaging) {
    messaging().getToken().then(updateToken);
    messaging().onTokenRefresh(updateToken);

    messaging().setBackgroundMessageHandler(handleMessage);
    messaging().onMessage(handleMessage);
  }
};

const setUpHandler = () => {
  PushNotification.configure({
    onNotification: (notification) => {
      if (notification.userInteraction) {
        let action: { data: string; type: string } | undefined;
        if (notification.action) {
          action = notification.data.actions?.find(
            (a: { text: string; action: { type: string; data: string } }) =>
              a.text === notification.action,
          )?.action;
        } else {
          action = notification.data.onPress;
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

      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    requestPermissions: false,
  });
};

export { setUpHandler, setUpMessaging };
