import React, { useState } from 'react';
import { View, Platform, UIManager, LayoutAnimation, ViewStyle, StyleProp } from 'react-native';

const { configureNext, create } = LayoutAnimation;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  collapsed: boolean;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  children?: React.ReactNode;
};

const CollapsibleView: React.FC<Props> = ({
  collapsed,
  style,
  duration = 200,
  children,
  ...viewProps
}) => {
  const [collapsedState, setCollapsedState] = useState(collapsed);
  if (collapsedState !== collapsed) {
    configureNext(create(duration, 'easeInEaseOut', 'opacity'));
    setCollapsedState(collapsed);
  }
  return collapsedState ? null : (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <View style={style} {...viewProps}>
      {children}
    </View>
  );
};

export default CollapsibleView;
