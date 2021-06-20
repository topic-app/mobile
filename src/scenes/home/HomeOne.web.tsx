import React from 'react';

import { useLayout } from '@utils';

import AndroidNavigator from './HomeOne.android';
import IosNavigator from './HomeOne.ios';

const HomeOneNavigator = () => {
  if (useLayout() === 'desktop') {
    return <IosNavigator />;
  } else {
    return <AndroidNavigator />;
  }
};

export default HomeOneNavigator;
