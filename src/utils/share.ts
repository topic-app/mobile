import { Platform, Share, Clipboard } from 'react-native';

import config from '@constants/config';

import Alert from './alert';
import logger from './logger';

type shareProps = {
  title: string;
  group?: string;
  type: 'articles' | 'evenements' | 'utilisateurs' | 'groupes' | 'lieux';
  id: string;
};
const share = async ({ title, group, type, id }: shareProps) => {
  const url = `${config.links.share}/${type}/${id}`;
  const message = group ? `${title} par ${group}` : title;
  try {
    await Platform.select({
      ios: () =>
        Share.share({
          message,
          url,
        }),
      android: () =>
        Share.share({
          message: url,
          title: message,
        }),
      default: () =>
        Share.share({
          message: '',
          title: `${message} ${url}`,
        }),
    })();
  } catch (err) {
    logger.warn('Error while accessing share api, trying clipboard');
    if (((Clipboard.setString(url) as unknown) as boolean) || false) {
      Alert.alert(
        'Lien copié dans le presse papier',
        `Collez le pour partager${'\n'}${url}`,
        [{ text: 'Fermer' }],
        { cancelable: true },
      );
    } else {
      Alert.alert(
        'Erreur lors du partage',
        `Vous pouvez copier ce lien pour partager : ${url}`,
        [{ text: 'Fermer' }],
        { cancelable: true },
      );
    }
  }
};

export default share;
