import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Platform, View, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Text, Button, Divider, Checkbox, List } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  Illustration,
  ErrorMessage,
  TranslucentStatusBar,
  CustomHeaderBar,
} from '@components/index';
import { linking } from '@redux/actions/apiActions/linking';
import { logout } from '@redux/actions/data/account';
import { accountDelete } from '@redux/actions/data/profile';
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

  const { id, token } = route.params;

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

  const submit = () => {
    accountDelete(id, token, values).then(() => {
      logout();
      navigation.replace('Root', {
        screen: 'Main',
        params: {
          screen: 'Home1',
          params: { screen: 'Home2', params: { screen: 'Article' } },
        },
      });
      Alert.alert(
        'Compte supprimé',
        'Adieu :(',
        [
          {
            text: 'Fermer',
          },
        ],
        { cancelable: true },
      );
    });
  };

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              hideBack: true,
              title: 'Topic',
              subtitle: 'Suppression du compte',
            },
          },
        }}
      />
      <View style={{ flex: 1, flexGrow: 1 }}>
        <ScrollView>
          {state.accountDelete.error ? (
            <View>
              <ErrorMessage
                type="axios"
                strings={{
                  what: "l'ouverture du lien",
                  contentSingular: 'Le lien',
                }}
                error={state.accountDelete.error}
                retry={submit}
              />
            </View>
          ) : null}
          <View
            style={[styles.centerIllustrationContainer, styles.contentContainer, { marginTop: 40 }]}
          >
            <Illustration name="empty" height={200} width={200} />
            <Text style={linkingStyles.title}>Voulez vous vraiment supprimer votre compte?</Text>
            <Text>
              Cette action est réversible dans les 7 jours qui suivent la suppression, et votre
              compte sera supprimé au bout d&aposun mois au plus tard.{'\n\n'}Vous pouvez toujours
              utiliser l&apos;application sans compte ou le site web www.topicapp.fr.{'\n\n\n'}Vous
              pouvez choisir de supprimer certaines données ou non, toutefois cette décision
              n&apos;est pas reversible :
            </Text>
          </View>
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
        </ScrollView>
        <View>
          <Divider />
          <View style={linkingStyles.formContainer}>
            <View style={linkingStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                disabled={state.accountDelete.loading}
                loading={state.accountDelete.loading}
                onPress={submit}
                style={{ flex: 1 }}
              >
                Supprimer définitivement mon compte
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