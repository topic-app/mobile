import React from 'react';
import { List } from 'react-native-paper';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { styles } from '../../../styles/Styles';

function SettingsHomeScreen({ navigation }) {
  return (
    <View style={styles.page}>
      <List.Section>
        <List.Item
          title="General"
          left={() => <List.Icon icon="settings" />}
          onPress={() => navigation.navigate('SettingsGeneral')}
        />
        <List.Item
          title="Appearance"
          left={() => <List.Icon icon="palette" />}
          onPress={() => navigation.navigate('SettingsAppearance')}
        />
        <List.Item
          title="Behavior"
          left={() => <List.Icon icon="emoticon" />}
          onPress={() => navigation.navigate('SettingsBehavior')}
        />
      </List.Section>
    </View>
  );
}

export default SettingsHomeScreen;

SettingsHomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
