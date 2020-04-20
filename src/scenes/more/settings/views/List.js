import React from 'react';
import { List, Divider, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import getStyles from '../../../../styles/Styles';
import getSettingsStyles from '../styles/Styles';

class SettingsList extends React.Component {
  render() {
    const { theme } = this.props;
    const styles = getStyles(theme);
    const settingsStyles = getSettingsStyles(theme);

    return (
      <View style={styles.page}>
        <List.Section>
          <List.Subheader>Apparence</List.Subheader>
          <Divider />
          <List.Item
            title="Theme"
            description="Clair"
            left={() => <List.Icon icon="brightness-6" />}
            onPress={() => console.log('Theme')}
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
            title="Qualité d'Images"
            description="Haute, Moyenne, Basse"
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
          <List.Item
            title="Autre"
            description="Version, Crédits, licenses etc"
            left={() => <List.Icon icon="help-circle-outline" />}
            onPress={() => console.log('Other')}
            style={settingsStyles.listItem}
          />
        </List.Section>
      </View>
    );
  }
}

SettingsList.propTypes = {
  theme: PropTypes.shape({}).isRequired,
};

export default withTheme(SettingsList);
