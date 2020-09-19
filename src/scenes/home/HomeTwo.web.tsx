import React from 'react';
import AndroidNavigator from './HomeTwo.android';
import IosNavigator from './HomeTwo.ios';
import getLayout from '@utils/getLayout';

const HomeTwoNavigator = () => {
  if (getLayout() === 'desktop') {
    return <IosNavigator />;
  } else {
    return <AndroidNavigator />;
  }
};

export default HomeTwoNavigator;
