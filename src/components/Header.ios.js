import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';

import { theme, colors } from '../styles/Theme';
import { navigatorStyles } from '../styles/NavStyles';
import { styles } from '../styles/Styles';

function TranslucentStatusBar({ contentThemeName }) {
  let translucent = false;
  if (theme.statusBarTranslucent) {
    translucent = true;
  }
  return (
    <StatusBar
      translucent={translucent}
      backgroundColor={colors.statusBar}
      barStyle={`${contentThemeName}-content`}
    />
  );
}

TranslucentStatusBar.propTypes = {
  contentThemeName: PropTypes.string,
};

TranslucentStatusBar.defaultProps = {
  contentThemeName: theme.dark === true ? 'light' : 'dark',
};

const ListHeaderConfig = {
  headerStyle: navigatorStyles.header,
  headerTitleStyle: styles.text,
  headerBackTitleStyle: styles.text,
};

const DisplayHeaderConfig = ListHeaderConfig;

export { TranslucentStatusBar, ListHeaderConfig, DisplayHeaderConfig };
