import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { withTheme } from 'react-native-paper';

import getStyles from '@styles/Styles';
import { ListItem, ListSection } from '../components/ListComponents';

function MoreList({ navigation, theme }) {
  const styles = getStyles(theme);
  return (
    <View style={styles.page}>
      <ScrollView>
        <ListSection>
          <ListItem
            label="Mon Profil"
            icon="account-outline"
            theme={theme}
            onPress={() => console.log('Profile')}
          />
          <ListItem
            label="Mes Groupes"
            icon="account-group-outline"
            theme={theme}
            onPress={() => console.log('Groups')}
          />
          <ListItem
            label="Modération"
            icon="shield-check-outline"
            theme={theme}
            onPress={() => console.log('Moderation')}
          />
          <ListItem
            label="Paramètres"
            icon="settings"
            theme={theme}
            onPress={() => console.log('Hello')}
          />
        </ListSection>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { account } = state;
  return { accountInfo: account.accountInfo, loggedIn: account.loggedIn };
};

export default withTheme(MoreList);

MoreList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired,
  }).isRequired,
};
