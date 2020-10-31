import React from 'react';

import getLayout from '@utils/getLayout';

import AndroidNavigator from './HomeOne.android';
import IosNavigator from './HomeOne.ios';

const HomeOneNavigator = () => {
  if (getLayout() === 'desktop') {
    return <IosNavigator />;
  } else {
    return <AndroidNavigator />;
  }
};

export default HomeOneNavigator;
