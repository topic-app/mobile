import { useLinkTo } from '@react-navigation/native';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

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
          PushNotification.localNotification({
            channelId: push.channel?.id,
            title: push.title,
            message: push.content,
            color: 'primary',
            actions: push.actions?.map((a: { text: string }) => a?.text),
            userInfo: { onPress: push.onPress, actions: push.actions },
          });
        },
      );
    } else if (Platform.OS === 'ios') {
      PushNotification.localNotification({
        category: push.channel?.id,
        title: push.title,
        message: push.message,
        playSound: priority === 'urgent' || priority === 'high' || priority === 'medium',
      });
    }
  }
};

function Deferred(): void {
  this.promise = new Promise((resolve, reject) => {
    this.reject = reject;
    this.resolve = resolve;
  });
}

const setUpMessaging = () => {
  const navigationDeferred: PromiseConstructor = new Deferred();

  if (Platform.OS !== 'web' && messaging) {
    messaging().setBackgroundMessageHandler(handleMessage);
  }

  PushNotification.configure({
    onNotification: (notification) => {
      navigationDeferred.promise.then((navigation) => {
        if (notification.userInteraction) {
          let action: { data: string; type: string } | undefined;
          if (notification.action) {
            action = notification.data.actions?.find(
              (a: { text: string; action: { type: string; data: string } }) =>
                a.text === notification.action,
            )?.action;
          } else {
            action = notification.data.onPress?.action;
          }
          if (!action) {
            logger.warn('No action on notification');
            return;
          }
          if (action.type === 'link') {
            const linkTo = useLinkTo();
            linkTo(action.data);
          }
        }
      });
    },

    requestPermissions: false,
  });

  return navigationDeferred;
};

export default setUpMessaging;
