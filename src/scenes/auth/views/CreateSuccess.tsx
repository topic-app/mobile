import React from 'react';
import { Platform, View, FlatList } from 'react-native';
import { Text, Button, Divider, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration } from '@components/index';
import { updateGroups } from '@redux/actions/api/groups';
import { fetchAccount } from '@redux/actions/data/account';
import { resendVerification } from '@redux/actions/data/profile';
import getStyles from '@styles/Styles';
import { State, LocationList, GroupPreload, Group } from '@ts/types';
import { useTheme, logger } from '@utils/index';

import type { AuthScreenNavigationProp } from '../index';
import getAuthStyles from '../styles/Styles';

type AuthCreateSuccessProps = {
  navigation: AuthScreenNavigationProp<'CreateSuccess'>;
  location: LocationList;
  groups: (GroupPreload | Group)[];
};

const AuthCreateSuccess: React.FC<AuthCreateSuccessProps> = ({ navigation, location, groups }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const authStyles = getAuthStyles(theme);
  const { colors } = theme;

  React.useEffect(() => {
    updateGroups('initial', { schools: location.schools });
  }, []);

  return (
    <View style={styles.page}>
      <FlatList
        data={groups}
        renderItem={(item) => null /* <Text>{JSON.stringify(item)}</Text> */}
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
        action={{ label: 'Renvoyer', onPress: () => resendVerification() }}
      >
        Email de vérification envoyé
      </Snackbar>
      <Divider />
      <View style={authStyles.formContainer}>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              fetchAccount();
              navigation.navigate('Main', {
                screen: 'Home1',
                params: { screen: 'Home2', params: { screen: 'Article' } },
              });
            }}
            style={{ flex: 1 }}
          >
            Continuer
          </Button>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { location, groups } = state;
  return { location, groups: groups.data };
};

export default connect(mapStateToProps)(AuthCreateSuccess);
