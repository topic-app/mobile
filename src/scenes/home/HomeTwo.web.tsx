import React from 'react';

import getLayout from '@utils/getLayout';

import AndroidNavigator from './HomeTwo.android';
import IosNavigator from './HomeTwo.ios';

const HomeTwoNavigator = () => {
  if (getLayout() === 'desktop') {
    return <IosNavigator />;
  } else {
    return <AndroidNavigator />;
  }
};

export default HomeTwoNavigator;
