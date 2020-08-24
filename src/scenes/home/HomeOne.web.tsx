import React from 'react';
import AndroidNavigator from './HomeOne.android';
import IosNavigator from './HomeOne.ios';
import getLayout from '@utils/getLayout';
const HomeOneNavigator = () => {
  if (getLayout() === 'desktop') {
    return <IosNavigator />;
  } else {
    return <AndroidNavigator />;
  }
};

export default HomeOneNavigator;
