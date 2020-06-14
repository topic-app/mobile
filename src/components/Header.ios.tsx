import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, TouchableOpacity } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, Appbar, Text } from 'react-native-paper';

import getNavigatorStyles from '@styles/NavStyles';

function TranslucentStatusBar({ contentThemeName }) {
  const theme = useTheme();
  const { colors } = theme;
  const contentTheme = contentThemeName || theme.statusBarContentTheme;
  return (
    <StatusBar
      translucent
      backgroundColor={colors.statusBar}
      barStyle={`${contentTheme}-content`}
    />
  );
}

function SolidStatusBar({ color, contentThemeName }) {
  const theme = useTheme();
  const contentTheme = contentThemeName || theme.statusBarContentTheme;
  const backgroundColor = color || theme.colors.background;
  return (
    <StatusBar
      translucent={false}
      backgroundColor={backgroundColor}
      barStyle={`${contentTheme}-content`}
    />
  );
}

function BackButton({ onPress, previous }) {
  const theme = useTheme();
  const backColor = theme.dark ? '#0a84ff' : '#0a7aff';
  return (
    <View>
      <TranslucentStatusBar />
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="ios-arrow-back"
            size={30}
            style={{ paddingTop: 2, paddingLeft: 7 }}
            color={backColor}
          />
          <Text style={{ fontSize: 16, paddingLeft: 5, color: backColor }}>
            {previous ?? 'Retour'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function CustomHeaderBar({ scene, navigation }) {
  const theme = useTheme();
  const navigatorStyles = getNavigatorStyles(theme);

  const {
    title,
    subtitle, // On iOS, we want to see the subtitle as a title
    headerStyle,
    primary,
    home,
  } = scene.descriptor.options;

  let headerTitle;
  if (subtitle) {
    headerTitle = subtitle;
  } else if (title) {
    headerTitle = title;
  } else {
    headerTitle = scene.route.name;
  }

  let primaryAction;
  if (primary) {
    primaryAction = <BackButton onPress={primary} />;
  } else if (home) {
    primaryAction = null;
  } else {
    primaryAction = <BackButton onPress={navigation.goBack} />;
  }

  const insets = useSafeArea();

  return (
    <View style={navigatorStyles.headerSurface}>
      <TranslucentStatusBar />
      <Appbar.Header statusBarHeight={insets.top} style={[navigatorStyles.header, headerStyle]}>
        {primaryAction}
        <Appbar.Content title={headerTitle} />
      </Appbar.Header>
    </View>
  );
}

TranslucentStatusBar.propTypes = {
  contentThemeName: PropTypes.string,
};

TranslucentStatusBar.defaultProps = {
  contentThemeName: '',
};

SolidStatusBar.propTypes = {
  color: PropTypes.string.isRequired,
  contentThemeName: PropTypes.string,
};

SolidStatusBar.defaultProps = {
  contentThemeName: '',
};

BackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  previous: PropTypes.string,
};

BackButton.defaultProps = {
  previous: null,
};

CustomHeaderBar.propTypes = {
  scene: PropTypes.shape({
    descriptor: PropTypes.shape({
      options: PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        headerStyle: PropTypes.object,
        primary: PropTypes.func,
        home: PropTypes.bool,
        overflow: PropTypes.arrayOf(PropTypes.object),
        actions: PropTypes.arrayOf(PropTypes.object),
      }).isRequired,
    }).isRequired,
    route: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    openDrawer: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const HeaderConfig = {
  header: ({ scene, navigation }) => <CustomHeaderBar scene={scene} navigation={navigation} />,
};

export { TranslucentStatusBar, SolidStatusBar, HeaderConfig, CustomHeaderBar };
