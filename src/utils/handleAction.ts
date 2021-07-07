import { Share, Clipboard } from 'react-native';
import parseUrl from 'url-parse';

import { logger } from '@utils';

const handleAction = (
  actionType: string,
  actionData: string | undefined,
  linkTo: (pathname: string) => void,
) => {
  if (!actionType || !actionData) {
    logger.warn('No action on notification');
    return;
  }
  if (actionType === 'link') {
    const { pathname, query } = parseUrl(actionData);
    linkTo(`${pathname}${query}`);
  } else if (actionType === 'share') {
    Share.share({ message: actionData });
  } else if (actionType === 'copy') {
    Clipboard.setString(actionData);
  } else {
    logger.warn(`Action ${actionType} cannot be handled`);
  }
};

export default handleAction;
