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
import { linking } from '@redux/actions/apiActions/linking';
import getStyles from '@styles/Styles';
import { State, LinkingRequestState } from '@ts/types';
import { useTheme } from '@utils/index';

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

  const extras: {
    name: string;
    value: 'articles' | 'events' | 'petitions' | 'places' | 'comments';
  }[] = [
    {
      name: 'Articles',
      value: 'articles',
    },
    {
      name: 'Évènements',
      value: 'events',
    },
    {
      name: 'Pétitions',
      value: 'petitions',
    },
    {
      name: 'Lieux',
      value: 'places',
    },
    {
      name: 'Commentaires',
      value: 'comments',
    },
  ];

  const [values, setValues] = React.useState({
    articles: false,
    events: false,
    petitions: false,
    places: false,
    comments: false,
  });

  const fetch = () => {
    if (!currentType) {
      setError(true);
      return;
    }
    if (!currentType.confirm) {
      linking(
        currentType.url,
        currentType.parameters
          .map((t: string) => ({ [t]: parameters[t] || '' }))
          .reduce((e, prev) => ({ ...e, ...prev })),
        type,
        currentType.auth || false,
      );
    }
  };

  React.useEffect(fetch, []);

  const [confirmed, setConfirmed] = React.useState(false);

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              hideBack: true,
              title: 'Topic',
              subtitle: 'Lien email',
            },
          },
        }}
      />
      <View style={{ flex: 1, flexGrow: 1 }}>
        <ScrollView>
          {state[type]?.success ? (
            <View
              style={[
                styles.centerIllustrationContainer,
                styles.contentContainer,
                { marginTop: 40 },
              ]}
            >
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
          {currentType.confirm && !confirmed ? (
            <View
              style={[
                styles.centerIllustrationContainer,
                styles.contentContainer,
                { marginTop: 40 },
              ]}
            >
              <Illustration name="empty" height={200} width={200} />
              <Text style={linkingStyles.title}>{currentType.confirmTitle}</Text>
              <Text>{currentType.confirmText}</Text>
            </View>
          ) : null}
          {currentType.showExtras && !confirmed && (
            <View>
              {extras.map((e) => (
                <List.Item
                  title={e.name}
                  titleNumberOfLines={10}
                  left={() =>
                    Platform.OS !== 'ios' ? (
                      <Checkbox
                        status={values[e.value] ? 'checked' : 'unchecked'}
                        color={colors.primary}
                      />
                    ) : null
                  }
                  right={() =>
                    Platform.OS === 'ios' ? (
                      <Checkbox
                        status={values[e.value] ? 'checked' : 'unchecked'}
                        color={colors.primary}
                      />
                    ) : null
                  }
                  onPress={() => setValues({ ...values, [e.value]: !values[e.value] })}
                />
              ))}
            </View>
          )}
        </ScrollView>
        <View>
          <Divider />
          <View style={linkingStyles.formContainer}>
            <View style={linkingStyles.buttonContainer}>
              {confirmed || !currentType.confirm ? (
                <Button
                  disabled={state[type]?.loading}
                  loading={state[type]?.loading}
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
                  Continuer
                </Button>
              ) : (
                <Button
                  mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                  onPress={() => {
                    setConfirmed(true);
                    linking(
                      currentType.url,
                      {
                        ...currentType.parameters
                          .map((t: string) => ({ [t]: parameters[t] || '' }))
                          .reduce((e, prev) => ({ ...e, ...prev })),
                        ...(currentType.showExtras ? { [currentType.extrasName]: values } : {}),
                      },
                      type,
                      currentType.auth || false,
                    );
                  }}
                  style={{ flex: 1 }}
                >
                  {currentType.confirmButton}
                </Button>
              )}
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
