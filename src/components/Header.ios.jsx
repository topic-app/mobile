import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, TouchableOpacity } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withTheme, Appbar, Text } from 'react-native-paper';

import getNavigatorStyles from '@styles/NavStyles';

function TranslucentStatusBarUnthemed({ contentThemeName, theme }) {
  const contentTheme = contentThemeName || theme.statusBarContentTheme;
  const { colors } = theme;
  return (
    <StatusBar
      translucent
      backgroundColor={colors.statusBar}
      barStyle={`${contentTheme}-content`}
    />
  );
}

function SolidStatusBarUnthemed({ color, contentThemeName, theme }) {
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

const TranslucentStatusBar = withTheme(TranslucentStatusBarUnthemed);
const SolidStatusBar = withTheme(SolidStatusBarUnthemed);

function BackButtonUnthemed({ onPress, previous, theme }) {
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

const BackButton = withTheme(BackButtonUnthemed);

function CustomHeaderBarUnthemed({ scene, navigation, theme }) {
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
  if (primary !== undefined) {
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
      <Appbar.Header
        statusBarHeight={insets.top}
        style={[navigatorStyles.header, headerStyle && null]}
      >
        {primaryAction}
        <Appbar.Content title={headerTitle} />
      </Appbar.Header>
    </View>
  );
}

const CustomHeaderBar = withTheme(CustomHeaderBarUnthemed);

TranslucentStatusBarUnthemed.propTypes = {
  contentThemeName: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      statusBar: PropTypes.string.isRequired,
    }).isRequired,
    statusBarContentTheme: PropTypes.string.isRequired,
  }).isRequired,
};

TranslucentStatusBarUnthemed.defaultProps = {
  contentThemeName: '',
};

SolidStatusBarUnthemed.propTypes = {
  color: PropTypes.string.isRequired,
  contentThemeName: PropTypes.string,
  theme: PropTypes.shape({
    statusBarContentTheme: PropTypes.string.isRequired,
    colors: PropTypes.shape({
      background: PropTypes.shape.isRequired,
    }).isRequired,
  }).isRequired,
};

SolidStatusBarUnthemed.defaultProps = {
  contentThemeName: '',
};

BackButtonUnthemed.propTypes = {
  onPress: PropTypes.func.isRequired,
  previous: PropTypes.string,
  theme: PropTypes.shape({
    dark: PropTypes.bool.isRequired,
  }).isRequired,
};

BackButtonUnthemed.defaultProps = {
  previous: null,
};

CustomHeaderBarUnthemed.propTypes = {
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
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      drawerContent: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const HeaderConfig = {
  header: ({ scene, navigation }) => <CustomHeaderBar scene={scene} navigation={navigation} />,
};

export { TranslucentStatusBar, SolidStatusBar, HeaderConfig, CustomHeaderBar };
