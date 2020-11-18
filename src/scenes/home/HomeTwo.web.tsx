import React from 'react';

import { useLayout } from '@utils/index';

import AndroidNavigator from './HomeTwo.android';
import IosNavigator from './HomeTwo.ios';

const HomeTwoNavigator = () => {
  if (useLayout() === 'desktop') {
    return <IosNavigator />;
  } else {
    return <AndroidNavigator />;
  }
};

export default HomeTwoNavigator;
