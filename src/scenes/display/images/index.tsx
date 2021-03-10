import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { DisplayScreenNavigationProp } from '../index';
import ImageDisplay from './views/Display';

export type ImageDisplayStackParams = {
  Display: { image: string };
};

export type ImageDisplayScreenNavigationProp<
  K extends keyof ImageDisplayStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<ImageDisplayStackParams, K>,
  DisplayScreenNavigationProp<'Image'>
>;

const Stack = createNativeStackNavigator<ImageDisplayStackParams>();

function ImageDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={ImageDisplay} options={{ title: 'Image' }} />
    </Stack.Navigator>
  );
}

export default ImageDisplayStackNavigator;
