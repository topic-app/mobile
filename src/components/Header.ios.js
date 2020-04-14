import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View } from 'react-native';
import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { theme } from '../styles/Theme';
import { navigatorStyles } from '../styles/NavStyles';
import { styles, colors, isDark } from '../styles/Styles';

function TranslucentStatusBar({ contentThemeName }) {
  return (
    <StatusBar
      translucent
      backgroundColor={colors.statusBar}
      barStyle={`${contentThemeName}-content`}
    />
  );
}

function BackButton({ navigation, previous }) {
  const backColor = isDark ? '#0a84ff' : '#0a7aff';
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

TranslucentStatusBar.propTypes = {
  contentThemeName: PropTypes.string,
};

TranslucentStatusBar.defaultProps = {
  contentThemeName: theme.statusBarContentTheme,
};

BackButton.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  previous: PropTypes.string,
};

BackButton.defaultProps = {
  previous: null,
};

const HeaderConfig = {
  headerStyle: navigatorStyles.header,
  headerTitleStyle: styles.text,
  headerBackTitleStyle: styles.text,
  BackButton,
};

const TransitionHeaderConfig = HeaderConfig;

export { TranslucentStatusBar, HeaderConfig, TransitionHeaderConfig };
