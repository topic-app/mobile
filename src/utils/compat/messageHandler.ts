import { Platform, Share } from 'react-native';
import PushNotification from 'react-native-push-notification';
import parseUrl from 'url-parse';

import { updateToken } from '@redux/actions/data/profile';
import Store from '@redux/store';
import { handleAction, logger, messaging } from '@utils';

const onNotification = (
  notification: { data?: { actionType?: string; actionData?: string } } | null,
  linkTo: (path: string) => void,
) => {
  if (notification) {
    logger.info('Notification clicked, executing action');
    const { actionType, actionData } = notification.data || {};
    if (actionType) {
      handleAction(actionType, actionData, linkTo);
    } else {
      logger.warn('Action has no type');
    }
  }
};

const channels = [
  {
    id: 'moderation',
    name: 'Modération',
    description: 'Contenus en modération, suppressions, modifications',
    playSound: true,
    importance: 4,
  },
  {
    id: 'groups',
    name: 'Groupes',
    description: 'Invitations, ajout et suppression de membres',
    playSound: true,
    importance: 4,
  },
  {
    id: 'content',
    name: 'Contenus',
    description: 'Contenus publiés par les groupes que vous suivez',
    playSound: false,
    importance: 2,
  },
  {
    id: 'eventmessages',
    name: "Messages d'évènements",
    description: 'Messages publiés sur les évènements que vous suivez',
    playSound: false,
    importance: 2,
  },
  {
    id: 'eventmessagesimportant',
    name: "Messages importants d'évènements",
    description: 'Messages importants publiés sur les évènements que vous suivez',
    playSound: true,
    importance: 4,
  },
  {
    id: 'broadcasts',
    name: 'Annonces',
    description: "Messages de l'équipe Topic",
    playSound: true,
    importance: 4,
  },
  {
    id: 'default',
    name: 'Autres',
    description: 'Notifications sans catégorie spécifique',
    playSound: true,
    importance: 4,
  },
];

const setUpMessagingLoaded = () => {
  if (Platform.OS !== 'web' && messaging) {
    // Handle fcm token
    if (Store.getState().account.loggedIn) {
      messaging().getToken().then(updateToken);
      messaging().onTokenRefresh(updateToken);
    }

    // PushNotification.getChannels((i) => i.forEach((j) => PushNotification.deleteChannel(j)));
    // Create channels
    if (Platform.OS === 'android') {
      channels.forEach((channel) => {
        PushNotification.channelExists(channel.id, (exists) => {
          if (!exists) {
            PushNotification.createChannel(
              {
                channelId: channel.id,
                channelName: channel.name,
                channelDescription: channel.description,
                playSound: channel.playSound,
                importance: channel.importance,
              },
              () => {},
            );
          }
        });
      });
    }

    // Handle foreground messages
    messaging().onMessage((remoteMessage) => {
      if (!remoteMessage.notification) return;
      PushNotification.localNotification(
        Platform.OS === 'android'
          ? {
              title: remoteMessage.notification.title,
              message: remoteMessage.notification.body || '',
              channelId: remoteMessage.notification.android?.channelId || 'default',
            }
          : {
              title: remoteMessage.notification.title,
              message: remoteMessage.notification.body || '',
              category: remoteMessage.notification.android?.channelId || 'default',
            },
      );
    });
  }
};

const setUpActionListener = (linkTo: (path: string) => void) => {
  if (Platform.OS !== 'web' && messaging) {
    messaging()
      .getInitialNotification()
      .then((notif) => onNotification(notif, linkTo));
    messaging().onNotificationOpenedApp((notif) => onNotification(notif, linkTo));
  }
};

export { setUpMessagingLoaded, setUpActionListener };
