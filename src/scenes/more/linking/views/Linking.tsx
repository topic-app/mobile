import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Text, Button, Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration, ErrorMessage, TranslucentStatusBar } from '@components/index';
import { linking } from '@redux/actions/apiActions/linking';
import getStyles from '@styles/Styles';
import { State, LinkingRequestState } from '@ts/types';

import types from '../data/types.json';
import type { LinkingScreenNavigationProp, LinkingStackParams } from '../index';
import getLinkingStyles from '../styles/Styles';

type Props = {
  navigation: LinkingScreenNavigationProp<'Linking'>;
  route: RouteProp<LinkingStackParams, 'Linking'>;
  state: LinkingRequestState;
};

const Linking: React.FC<Props> = ({ navigation, route, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const linkingStyles = getLinkingStyles(theme);
  const { colors } = theme;

  const { type, ...parameters } = route.params;

  const currentType = types[type];
  const [error, setError] = React.useState(true);

  const fetch = () => {
    if (!currentType) {
      setError(true);
      return;
    }
    linking(
      currentType.url,
      currentType.parameters
        .map((t: string) => ({ [t]: parameters[t] || '' }))
        .reduce((e, prev) => ({ ...e, ...prev })),
      type,
    );
  };

  React.useEffect(fetch, []);

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <View style={{ flex: 1, flexGrow: 1, justifyContent: 'space-between' }}>
        {state[type]?.success ? (
          <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
            <Illustration name="auth-register-success" height={200} width={200} />
            <Text style={linkingStyles.title}>{currentType.title}</Text>
            <Text>{currentType.text}</Text>
          </View>
        ) : state[type]?.error || error ? (
          <View>
            <ErrorMessage
              type="axios"
              strings={{
                what: "l'ouverture du lien",
                contentSingular: 'Le lien',
              }}
              error={state[type]?.error}
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
        <View>
          <Divider />
          <View style={linkingStyles.formContainer}>
            <View style={linkingStyles.buttonContainer}>
              <Button
                disabled={state[type]?.loading}
                loading={state[type]?.loading}
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() =>
                  navigation.replace('Main', {
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
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { linking } = state;
  return { state: linking.state };
};

export default connect(mapStateToProps)(Linking);
