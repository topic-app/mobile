import React from 'react';
import { SvgProps } from 'react-native-svg';

declare module '*.svg' {
  const content: React.FC<SvgProps>;
  export default content;
}

// TEMPORARY: Until someone finds out how to resolve these navigation errors
declare module '@utils/compat/stack' {
  type NativeStackNavigationProp<
    ParamList extends object,
    RouteName extends string
  > = NativeStackNavigationProp<any, any>;
}
