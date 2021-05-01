import React, { useState } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Collapsible from 'react-native-collapsible';

type Props = {
  collapsed: boolean;
  style?: StyleProp<ViewStyle>;
  align?: 'top' | 'center' | 'bottom';
  duration?: number;
  children?: React.ReactNode;
  renderChildrenCollapsed?: boolean;
};

const CollapsibleView: React.FC<Props> = ({
  collapsed,
  style,
  align = 'top',
  duration = 200,
  children,
  renderChildrenCollapsed = true,
  ...viewProps
}) => {
  return (
    <Collapsible
      collapsed={collapsed}
      renderChildrenCollapsed={renderChildrenCollapsed}
      align={align}
      style={{ flex: 1 }}
    >
      <View style={style} {...viewProps}>
        {children}
      </View>
    </Collapsible>
  );
};

export default CollapsibleView;
