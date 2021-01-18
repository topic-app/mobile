import { Platform, Share } from 'react-native';

import config from '@constants/config';

type shareProps = {
  title: string;
  group?: string;
  type: 'articles' | 'evenements' | 'utilisateurs' | 'groupes' | 'lieux';
  id: string;
};
export default Platform.select({
  ios: ({ title, group, type, id }: shareProps) =>
    Share.share({
      message: group ? `${title} par ${group}` : title,
      url: `${config.links.share}/${type}/${id}`,
    }),
  android: ({ title, group, type, id }: shareProps) =>
    Share.share({
      message: `${config.links.share}/${type}/${id}`,
      title: group ? `${title} par ${group}` : title,
    }),
  default: ({ title, group, type, id }: shareProps) =>
    Share.share({
      message: '',
      title: `${group ? `${title} par ${group}` : title} ${config.links.share}/${type}/${id}`,
    }),
});
