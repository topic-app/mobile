import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, TouchableOpacity } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import getNavigatorStyles from '../styles/NavStyles';
import getStyles from '../styles/Styles';

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

function BackButtonUnthemed({ navigation, previous, theme }) {
  const backColor = theme.dark ? '#0a84ff' : '#0a7aff';
  return (
    <View>
      <TranslucentStatusBar />
      <TouchableOpacity onPress={navigation.goBack}>
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
            {previous ?? 'Back'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const BackButton = withTheme(BackButtonUnthemed);

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
  color: PropTypes.string,
  contentThemeName: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      statusBar: PropTypes.string.isRequired,
      background: PropTypes.string.isRequired,
    }).isRequired,
    statusBarContentTheme: PropTypes.string.isRequired,
  }).isRequired,
};

SolidStatusBarUnthemed.defaultProps = {
  color: '',
  contentThemeName: '',
};

BackButtonUnthemed.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  previous: PropTypes.string,
  theme: PropTypes.shape({
    dark: PropTypes.bool.isRequired,
  }).isRequired,
};

BackButtonUnthemed.defaultProps = {
  previous: null,
};

function HeaderConfig(theme) {
  const navigatorStyles = getNavigatorStyles(theme);
  const styles = getStyles(theme);
  return {
    headerStyle: navigatorStyles.header,
    headerTitleStyle: styles.text,
    headerBackTitleStyle: styles.text,
    BackButton,
  };
}

const TransitionHeaderConfig = HeaderConfig;

export { TranslucentStatusBar, SolidStatusBar, HeaderConfig, TransitionHeaderConfig };
