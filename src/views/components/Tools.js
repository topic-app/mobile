import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View } from 'react-native';
import { Appbar } from 'react-native-paper';

import { selectedTheme, colors } from '../../styles/Styles';
import { navigatorStyles } from '../../styles/navigatorStyles';

function TranslucentStatusBar({ contentThemeName, backgroundColor }) {
  return (
    <StatusBar
      translucent
      backgroundColor={backgroundColor}
      barStyle={`${contentThemeName}-content`}
    />
  );
}

TranslucentStatusBar.propTypes = {
  contentThemeName: PropTypes.string,
  backgroundColor: PropTypes.string,
};

TranslucentStatusBar.defaultProps = {
  contentThemeName: selectedTheme === 'light' ? 'dark' : 'light',
  backgroundColor: 'transparent',
};

function CustomHeaderBar({ scene, previous, navigation, drawer }) {
  const { options } = scene.descriptor;
  let title = scene.route.name;
  if (options.headerTitle !== undefined) {
    title = options.headerTitle;
  } else if (options.title !== undefined) {
    title = options.title;
  }

  let subtitle;
  if (options.headerSubtitle !== undefined) {
    subtitle = options.headerSubtitle;
  } else if (options.title !== undefined) {
    subtitle = options.subtitle;
  }

  let { headerStyle } = navigatorStyles;
  if (options.headerStyle !== undefined) {
    headerStyle = options.headerStyle;
  }

  return (
    <View>
      <TranslucentStatusBar backgroundColor="rgba(0,0,0,0.3)" />
      <Appbar.Header style={headerStyle} statusBarHeight={StatusBar.currentHeight}>
        {drawer ? <Appbar.Action icon="menu" onPress={navigation.openDrawer} /> : undefined}
        {!drawer && previous ? <Appbar.BackAction onPress={navigation.goBack} /> : undefined}
        <Appbar.Content title={title} subtitle={subtitle} />
      </Appbar.Header>
    </View>
  );
}

CustomHeaderBar.propTypes = {
  scene: PropTypes.shape({
    descriptor: PropTypes.shape({
      options: PropTypes.shape({
        headerTitle: PropTypes.string,
        headerSubtitle: PropTypes.string,
        headerStyle: PropTypes.object,
        title: PropTypes.string,
        subtitle: PropTypes.string,
      }).isRequired,
    }).isRequired,
    route: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  previous: PropTypes.shape({
    descriptor: PropTypes.object,
    progress: PropTypes.object,
    route: PropTypes.object,
  }),
  navigation: PropTypes.shape({
    openDrawer: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  drawer: PropTypes.bool,
};

CustomHeaderBar.defaultProps = {
  previous: undefined,
  drawer: false,
};

function HLine({ width, height, color, paddingVertical, borderRadius }) {
  return (
    <View style={{ width: '100%', alignItems: 'center', paddingVertical }}>
      <View style={{ width, height, borderRadius, backgroundColor: color }} />
    </View>
  );
}

HLine.defaultProps = {
  width: '100%',
  height: 1.5,
  color: colors.outline,
  paddingVertical: 10,
  borderRadius: 20,
};

HLine.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  paddingVertical: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export { HLine, TranslucentStatusBar, CustomHeaderBar };
