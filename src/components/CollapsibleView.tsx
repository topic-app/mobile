import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, UIManager, LayoutAnimation, ViewPropTypes } from 'react-native';

const { configureNext, create } = LayoutAnimation;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function CollapsibleView({ collapsed, style, duration, children, ...viewProps }) {
  const [collapsedState, setCollapsedState] = useState(collapsed);
  if (collapsedState !== collapsed) {
    configureNext(create(duration, 'easeInEaseOut', 'opacity'));
    setCollapsedState(collapsed);
  }
  return (
    !collapsedState && (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <View style={style} {...viewProps}>
        {children}
      </View>
    )
  );
}

export default CollapsibleView;

CollapsibleView.defaultProps = {
  duration: 200,
  style: null,
};

CollapsibleView.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
  style: ViewPropTypes.style,
};
