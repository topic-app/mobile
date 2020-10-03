import { useState, useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets as RNuseSafeAreaInsets } from 'react-native-safe-area-context';

export const useSafeAreaInsets = () => {
  let insets = RNuseSafeAreaInsets();
  if (Platform.OS === 'android') {
    insets.top = StatusBar.currentHeight;
  }
  return insets;
};
