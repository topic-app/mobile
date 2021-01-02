import React from 'react';
import { View, Appearance } from 'react-native';
import { List } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Preferences, State } from '@ts/types';
import { useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';

type PageDisplayProps = {
  navigation: PagesScreenNavigationProp<'Display'>;
};

const PageDisplay: React.FC<PageDisplayProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);

  return (
    <View style={styles.page}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Test',
            },
          },
        }}
      />
    </View>
  );
};

export default PageDisplay;
