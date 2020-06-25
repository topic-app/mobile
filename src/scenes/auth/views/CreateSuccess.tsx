import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Platform, View, FlatList } from 'react-native';
import { Text, Button, Divider, Snackbar, useTheme } from 'react-native-paper';

import getStyles from '@styles/Styles';
import { Illustration } from '@components/index';
import { updateGroups } from '@redux/actions/api/groups';
import getAuthStyles from '../styles/Styles';

function AuthCreateSuccess({ navigation, location, groups, state }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const authStyles = getAuthStyles(theme);
  const { colors } = theme;

  React.useEffect(() => {
    updateGroups('initial', { schools: location.schools });
  }, []);

  console.log(`Groups ${JSON.stringify(groups)}`);

  return (
    <View style={styles.page}>
      <FlatList
        data={groups}
        renderItem={(item) => <Text>{JSON.stringify(item)}</Text>}
        ListHeaderComponent={() => (
          <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
            <Illustration name="auth-register-success" height={200} width={200} />
            <Text style={authStyles.title}>Compte créé</Text>
          </View>
        )}
      />
      <Snackbar
        style={{ marginBottom: 100 }}
        theme={{ colors: { accent: colors.primaryLighter } }}
        visible
        onDismiss={() => null}
        action={{ label: 'Renvoyer', onPress: () => console.log('Resend email') }}
      >
        Email de vérification envoyé
      </Snackbar>
      <Divider />
      <View style={authStyles.formContainer}>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'Home1',
                params: { screen: 'Home2', params: { screen: 'Article' } },
              })
            }
            style={{ flex: 1 }}
          >
            Continuer
          </Button>
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { location, groups } = state;
  return { location, groups: groups.data, state: groups.state };
};

export default connect(mapStateToProps)(AuthCreateSuccess);

AuthCreateSuccess.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape(),
};
