import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Platform, View, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Button, Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration, ErrorMessage, TranslucentStatusBar, PageContainer } from '@components';
import { fetchAccount } from '@redux/actions/data/account';
import { emailVerify } from '@redux/actions/data/profile';
import { State, LinkingRequestState } from '@ts/types';

import type { LinkingScreenNavigationProp, LinkingStackParams } from '.';
import getStyles from './styles';

type Props = {
  navigation: LinkingScreenNavigationProp<'EmailVerify'>;
  route: RouteProp<LinkingStackParams, 'EmailVerify'>;
  state: LinkingRequestState;
};

const Linking: React.FC<Props> = ({ navigation, route, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const { id, token } = route.params;

  const fetch = () => {
    emailVerify(id, token).then(() => fetchAccount());
  };

  React.useEffect(fetch, []);

  return (
    <PageContainer
      headerOptions={{
        hideBack: true,
        title: 'Topic',
        subtitle: "Vérification de l'adresse email",
      }}
    >
      <View style={{ flex: 1, flexGrow: 1 }}>
        <ScrollView>
          {state.emailVerify.error ? (
            <View>
              <ErrorMessage
                type="axios"
                strings={{
                  what: "l'ouverture du lien",
                  contentSingular: 'Le lien',
                }}
                error={state.emailVerify.error}
                retry={fetch}
              />
            </View>
          ) : state.emailVerify.loading ? (
            <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
              <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.centerIllustrationContainer,
                styles.contentContainer,
                { marginTop: 40 },
              ]}
            >
              <Illustration name="auth-register-success" height={200} width={200} />
              <Text style={styles.title}>Adresse email vérifiée !</Text>
              <Text>
                Vous pouvez maintenant rejoindre et créer des groupes, écrire des commentaires...
              </Text>
            </View>
          )}
        </ScrollView>
        <View>
          <Divider />
          <View style={styles.formContainer}>
            <View style={styles.buttonContainer}>
              <Button
                disabled={state.emailVerify.loading}
                loading={state.emailVerify.loading}
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() =>
                  navigation.replace('Root', {
                    screen: 'Main',
                    params: {
                      screen: 'Home1',
                      params: { screen: 'Home2', params: { screen: 'Article' } },
                    },
                  })
                }
                style={{ flex: 1 }}
              >
                {state.emailVerify.error ? 'Retour' : 'Continuer'}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { linking } = state;
  return { state: linking.state };
};

export default connect(mapStateToProps)(Linking);
