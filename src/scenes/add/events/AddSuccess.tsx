import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Platform, View, ScrollView, Clipboard } from 'react-native';
import { Text, Button, Divider, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { Illustration, ErrorMessage } from '@components';
import { eventVerificationApprove } from '@redux/actions/apiActions/events';
import { State, EventRequestState, Account } from '@ts/types';
import { checkPermission, Alert, shareContent, Permissions } from '@utils';

import type { EventAddScreenNavigationProp, EventAddStackParams } from '.';
import getStyles from './styles';

type EventAddSuccessProps = {
  navigation: EventAddScreenNavigationProp<'Success'>;
  route: RouteProp<EventAddStackParams, 'Success'>;
  reqState: EventRequestState;
  account: Account;
};

const EventAddSuccess: React.FC<EventAddSuccessProps> = ({
  navigation,
  reqState,
  account,
  route,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [approved, setApproved] = React.useState(false);

  const { id, creationData } = route?.params || {};

  const groupName = account?.groups?.find((g) => g._id === creationData?.group)?.name;

  const approve = () => {
    if (id) eventVerificationApprove(id).then(() => setApproved(true));
  };

  return (
    <View style={styles.page}>
      {reqState.verification_approve?.success === false && (
        <SafeAreaView style={{ flex: 1 }}>
          <ErrorMessage
            error={reqState.verification_approve?.error}
            strings={{
              what: "l'approbation de l'évènement",
              contentSingular: "L'évènement",
            }}
            type="axios"
            retry={approve}
          />
        </SafeAreaView>
      )}
      <ScrollView>
        <View
          style={[styles.centerIllustrationContainer, styles.contentContainer, { marginTop: 40 }]}
        >
          <Illustration name="auth-register-success" height={200} width={200} />
          <Text style={[styles.title, { textAlign: 'center' }]}>
            Évènement {approved ? 'publié' : 'en attente de modération'}
          </Text>
          {!approved && (
            <View>
              <Text style={{ marginTop: 40, textAlign: 'center' }}>
                Votre évènement doit être approuvé par un administrateur de {groupName}.
              </Text>
              <Text style={{ textAlign: 'center' }}>
                Vous serez notifié dès que l&apos;évènement est approuvé.
              </Text>
            </View>
          )}
          {checkPermission(account, {
            permission: Permissions.EVENT_VERIFICATION_APPROVE,
            scope: { groups: [creationData?.group || ''] },
          }) &&
            (approved ? (
              <Text>Évènement approuvé par @{account?.accountInfo?.user?.info?.username}</Text>
            ) : (
              <View>
                <Text style={{ marginTop: 30 }}>
                  Vous pouvez approuver vous-même cet évènement.
                </Text>
                <Button
                  uppercase={Platform.OS !== 'ios'}
                  loading={reqState.verification_approve?.loading}
                  mode="outlined"
                  style={{ marginTop: 10 }}
                  onPress={() => {
                    Alert.alert(
                      "Approuver l'évènement ?",
                      "L'évènement doit être conforme aux conditions d'utilisation.\nVous êtes responsable si l'évènement ne les respecte pas, et nous pouvons désactiver votre compte si c'est le cas.\n\nDe plus, nous vous conseillons d'attendre l'approbation d'un autre membre, afin d'éviter les erreurs",
                      [
                        {
                          text: 'Annuler',
                        },
                        {
                          text: 'Approuver',
                          onPress: approve,
                        },
                      ],
                      { cancelable: true },
                    );
                  }}
                >
                  {reqState.verification_approve?.loading ? '' : 'Approuver'}
                </Button>
              </View>
            ))}
        </View>
        <View style={{ marginBottom: 30 }}>
          <View style={[styles.container, { marginTop: 20 }]}>
            <Text style={{ color: colors.disabled, marginBottom: 5, marginLeft: 10 }}>
              Lien de partage
            </Text>
            <Card
              elevation={0}
              style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
            >
              <View style={[styles.container, { flexDirection: 'row' }]}>
                <ScrollView horizontal>
                  <Text style={{ color: colors.text, fontSize: 20 }} numberOfLines={1}>
                    https://go.topicapp.fr/events/{id}
                  </Text>
                </ScrollView>
                <Icon
                  name="content-copy"
                  style={{ alignSelf: 'center', marginLeft: 10 }}
                  size={24}
                  color={colors.text}
                  onPress={() => {
                    Clipboard.setString(`https://go.topicapp.fr/events/${id}`);
                    Alert.alert(
                      'Lien copié',
                      "Vous ne pourrez pas utiliser ce lien tant que l'évènement n'aura pas été validé.",
                      [{ text: 'Fermer' }],
                      { cancelable: true },
                    );
                  }}
                />
                <Icon
                  name="share-variant"
                  style={{ alignSelf: 'center', marginLeft: 10 }}
                  size={24}
                  color={colors.text}
                  onPress={() => {
                    Alert.alert(
                      "Partager l'évènement",
                      "L'évènement ne sera pas accessible tant qu'il n'aura pas été approuvé.",
                      [
                        { text: 'Annuler' },
                        {
                          text: 'Partager',
                          onPress: () => {
                            if (!creationData?.title || !id) return;
                            shareContent({
                              title: `Évènement ${creationData.title}`,
                              group: groupName,
                              type: 'evenements',
                              id,
                            });
                          },
                        },
                      ],
                      { cancelable: true },
                    );
                  }}
                />
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
      <Divider />
      <View style={styles.formContainer}>
        <View style={styles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'Home1',
                params: { screen: 'Home2', params: { screen: 'Event' } },
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
  const { account, events } = state;
  return { account, reqState: events.state };
};

export default connect(mapStateToProps)(EventAddSuccess);
