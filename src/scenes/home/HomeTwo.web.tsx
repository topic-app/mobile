import React from 'react';

import { useLayout } from '@utils';

import AndroidNavigator from './HomeTwo.android';
import HomeTwoStack from './HomeTwoStack';

const HomeTwoNavigator = () => {
  if (useLayout() === 'desktop') {
    return <HomeTwoStack />;
  } else {
    return <AndroidNavigator />;
  }
};

export default HomeTwoNavigator;
