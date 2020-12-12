import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Platform, View, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Button, Divider, Checkbox, List } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  Illustration,
  ErrorMessage,
  TranslucentStatusBar,
  CustomHeaderBar,
} from '@components/index';
import { emailVerify } from '@redux/actions/data/profile';
import getStyles from '@styles/Styles';
import { State, LinkingRequestState } from '@ts/types';
import { useTheme } from '@utils/index';

import types from '../data/types.json';
import type { LinkingScreenNavigationProp, LinkingStackParams } from '../index';
import getLinkingStyles from '../styles/Styles';

type Props = {
  navigation: LinkingScreenNavigationProp<'EmailVerify'>;
  route: RouteProp<LinkingStackParams, 'EmailVerify'>;
  state: LinkingRequestState;
};

const Linking: React.FC<Props> = ({ navigation, route, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const linkingStyles = getLinkingStyles(theme);
  const { colors } = theme;

  const { id, token } = route.params;

  const fetch = () => {
    emailVerify(id, token);
  };

  React.useEffect(fetch, []);

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              hideBack: true,
              title: 'Topic',
              subtitle: "Vérification de l'adresse email",
            },
          },
        }}
      />
      <View style={{ flex: 1, flexGrow: 1 }}>
        <ScrollView>
          {state.emailVerify.success ? (
            <View
              style={[
                styles.centerIllustrationContainer,
                styles.contentContainer,
                { marginTop: 40 },
              ]}
            >
              <Illustration name="auth-register-success" height={200} width={200} />
              <Text style={linkingStyles.title}>Adresse email vérifiée !</Text>
              <Text>
                Vous pouvez maintenant rejoindre et créer des groupes, écrire des commentaires...
              </Text>
            </View>
          ) : state.emailVerify.error ? (
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
          ) : (
            <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
              <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            </View>
          )}
        </ScrollView>
        <View>
          <Divider />
          <View style={linkingStyles.formContainer}>
            <View style={linkingStyles.buttonContainer}>
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
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { linking } = state;
  return { state: linking.state };
};

export default connect(mapStateToProps)(Linking);
