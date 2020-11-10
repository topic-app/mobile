import React from 'react';
import { Platform, View, FlatList } from 'react-native';
import { Text, Button, Divider, Snackbar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';

import { Location, Group, State, GroupRequestState } from '@ts/types';
import { Illustration } from '@components/index';
import { useTheme, logger } from '@utils/index';
import getStyles from '@styles/Styles';
import { updateGroups } from '@redux/actions/api/groups';

import type { AuthStackParams } from '../index';
import getAuthStyles from '../styles/Styles';

type Props = {
  navigation: StackNavigationProp<AuthStackParams, 'CreateSuccess'>;
  location: Location;
  groups: Group[];
  reqState: GroupRequestState;
};

const AuthCreateSuccess: React.FC<Props> = ({ navigation, location, groups, reqState }) => {
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
        action={{ label: 'Renvoyer', onPress: () => logger.warn('Resend email not implemented') }}
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
};

const mapStateToProps = (state: State) => {
  const { location, groups } = state;
  return { location, groups: groups.data, reqState: groups.state };
};

export default connect(mapStateToProps)(AuthCreateSuccess);
