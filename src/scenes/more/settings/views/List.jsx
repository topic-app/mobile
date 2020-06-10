import React from 'react';
import { List, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import getSettingsStyles from '../styles/Styles';

function SettingsList({ navigation, preferences }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);

  return (
    <View style={styles.page}>
      <List.Section>
        <List.Item
          title="Theme"
          description={`${themes[preferences.theme]?.name}${
            preferences.useSystemTheme ? ' (système)' : ''
          }`}
          left={() => <List.Icon icon="brightness-6" />}
          onPress={() => navigation.navigate('Theme')}
          style={settingsStyles.listItem}
        />
        <List.Item
          title="Animations"
          description="iOS"
          left={() => <List.Icon icon="transition" />}
          onPress={() => console.log('Animations')}
          style={settingsStyles.listItem}
        />
        <List.Item
          title="Changer de location"
          description="Todo"
          left={() => <List.Icon icon="image-outline" />}
          onPress={() => console.log('Animations')}
          style={settingsStyles.listItem}
        />
        <List.Item
          title="Notifications"
          description="Push, Email"
          left={() => <List.Icon icon="bell-outline" />}
          onPress={() => console.log('Notification')}
          style={settingsStyles.listItem}
        />
      </List.Section>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { preferences } = state;
  return { preferences };
};

SettingsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  preferences: PropTypes.shape({
    theme: PropTypes.string,
    useSystemTheme: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(SettingsList);
