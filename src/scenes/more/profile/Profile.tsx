import React from 'react';
import { View, ScrollView } from 'react-native';
import {
  Text,
  Title,
  Subheading,
  Divider,
  Button,
  List,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import {
  Avatar,
  ErrorMessage,
  InlineCard,
  PageContainer,
  TranslucentStatusBar,
  VerificationBanner,
} from '@components';
import { fetchAccount, logout, deleteAccount, fetchEmail } from '@redux/actions/data/account';
import getStyles from '@styles/global';
import {
  Account,
  Address,
  State,
  ReduxLocation as OldReduxLocation,
  SchoolPreload,
  DepartmentPreload,
  AccountRequestState,
  User,
} from '@ts/types';
import { logger, Alert } from '@utils';

import type { ProfileScreenNavigationProp } from '.';
import EmailModal from './components/EmailModal';
import NameModal from './components/NameModal';
import PasswordModal from './components/PasswordModal';
import ProfileItem from './components/ProfileItem';
import UsernameModal from './components/UsernameModal';
import VisibilityModal from './components/VisibilityModal';

function getAddressString(address: Address['address']) {
  const { number, street, city, code } = address || {};
  if (number && street && city && code) {
    return `${number} ${street}, ${code} ${city}`;
  }
  if (city) return city;
  return null;
}

function genName({ data, info }: { data: User['data']; info: User['info'] }) {
  if (data.firstName && data.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data.firstName || data.lastName || null;
}

type ReduxLocation = OldReduxLocation & {
  schoolData: SchoolPreload[];
  departmentData: DepartmentPreload[];
};

type ProfileProps = {
  account: Account;
  location: ReduxLocation;
  state: AccountRequestState;
  navigation: ProfileScreenNavigationProp<'Profile'>;
};

const Profile: React.FC<ProfileProps> = ({ account, location, navigation, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [isVisibilityVisible, setVisibilityVisible] = React.useState(false);
  const [isNameVisible, setNameVisible] = React.useState(false);
  const [isUsernameVisible, setUsernameVisible] = React.useState(false);
  const [isEmailVisible, setEmailVisible] = React.useState(false);
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);

  React.useEffect(() => {
    fetchAccount();
    fetchEmail();
  }, []);

  if (!account.loggedIn) return <Text>Non autorisé</Text>;

  const deleteAccountFunc = () => {
    deleteAccount().then(() =>
      Alert.alert(
        'Vérifiez vos emails',
        `Un lien de confirmation à été envoyé à ${account.accountInfo?.email || 'votre email'}.`,
        [{ text: 'Fermer' }],
        { cancelable: true },
      ),
    );
  };

  return (
    <PageContainer
      headerOptions={{ title: 'Compte' }}
      loading={account.state.fetchAccount.loading}
      showError={account.state.fetchAccount.error || account.state.fetchEmail.error}
      errorOptions={{
        type: 'axios',
        strings: {
          what: 'la mise à jour du profil',
          contentPlural: 'des informations de profil',
          contentSingular: 'Le profil',
        },
        error: [account.state.fetchAccount.error, account.state.fetchEmail.error],
        retry: () => {
          fetchAccount();
          fetchEmail();
        },
      }}
      centered
    >
      <ScrollView>
        <VerificationBanner />
        <View style={[styles.contentContainer, { marginTop: 20 }]}>
          <View style={[styles.centerIllustrationContainer, { marginBottom: 10 }]}>
            <Avatar size={120} avatar={account.accountInfo?.user.info.avatar} />
          </View>
          <View style={[styles.centerIllustrationContainer, { flexDirection: 'row' }]}>
            {account.accountInfo?.user.data.public ? (
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Title>
                    {genName(account.accountInfo.user) ||
                      `@${account.accountInfo?.user.info.username}`}
                  </Title>
                  <View style={{ marginLeft: 5 }}>
                    {account.accountInfo.user.info.official && (
                      <Icon name="check-decagram" color={colors.primary} size={20} />
                    )}
                  </View>
                </View>
                {genName(account.accountInfo.user) && (
                  <Subheading style={{ marginTop: -10, color: colors.disabled }}>
                    @{account.accountInfo.user.info.username}
                  </Subheading>
                )}
              </View>
            ) : (
              <Title>@{account.accountInfo?.user.info.username}</Title>
            )}
          </View>
        </View>
        <View>
          <View style={{ height: 40 }} />
          <List.Subheader>Compte</List.Subheader>
          <Divider />
          <ProfileItem
            item="Visibilité"
            value={account.accountInfo.user.data.public ? 'Public' : 'Privé'}
            editable
            type="none"
            onPress={() => setVisibilityVisible(true)}
          />
          <ProfileItem
            item="Nom d'utilisateur"
            value={`@${account.accountInfo.user.info.username}`}
            editable
            type="public"
            onPress={() => setUsernameVisible(true)}
          />
          {account.accountInfo.user.data.public && (
            <View>
              <ProfileItem
                item="Nom"
                value={genName(account.accountInfo.user) || 'Non spécifié'}
                editable
                disabled={!genName(account.accountInfo.user)}
                type="public"
                onPress={() => setNameVisible(true)}
              />
            </View>
          )}
          <ProfileItem
            item="Adresse email"
            value={account.accountInfo.email || ''}
            editable
            type="private"
            onPress={() => setEmailVisible(true)}
            loading={account.state.fetchEmail.loading}
          />
          <View style={{ height: 50 }} />
          <List.Subheader>Localisation</List.Subheader>
          <Divider />
          <View>
            {location.global && (
              <InlineCard
                icon="map-marker"
                title="France Entière"
                onPress={() => logger.warn('global pressed')}
              />
            )}
            {location.schoolData?.map((school) => (
              <InlineCard
                key={school._id}
                icon="school"
                title={school.name}
                subtitle={`${
                  school.address
                    ? getAddressString(school.address?.address) || school.address?.shortName
                    : 'Adresse inconnue'
                }${
                  school.departments && school.departments[0]
                    ? `, ${school.departments[0].displayName || school.departments[0].name}`
                    : ''
                }`}
                onPress={() => logger.warn(`school ${school._id} pressed!`)}
              />
            ))}
            {location.departmentData?.map((dep) => (
              <InlineCard
                key={dep._id}
                icon="map-marker-radius"
                title={dep.name}
                subtitle={`${dep.type === 'departement' ? 'Département' : 'Région'} ${dep.code}`}
                onPress={() => logger.warn(`department ${dep._id} pressed!`)}
              />
            ))}
            <View style={styles.container}>
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate('Landing', {
                    screen: 'SelectLocation',
                    params: { goBack: true },
                  })
                }
              >
                Changer
              </Button>
            </View>
          </View>
          <View style={{ height: 50 }} />
          <List.Subheader>Authentification</List.Subheader>
          <Divider />
          <List.Item title="Changer mon mot de passe" onPress={() => setPasswordVisible(true)} />
          <List.Item
            disabled
            title="Activer l'Authentification à deux facteurs"
            titleStyle={{ color: colors.disabled }}
            onPress={() => {}}
          />
          <List.Item
            title="Se déconnecter"
            titleStyle={{ color: 'red' }}
            onPress={() => {
              navigation.popToTop();
              Alert.alert(
                'Se déconnecter ?',
                "Les listes et l'historique seront toujours disponibles sur votre téléphone",
                [
                  {
                    text: 'Annuler',
                  },
                  {
                    text: 'Se déconnecter',
                    onPress: logout,
                  },
                ],
                { cancelable: true },
              );
            }}
          />
          <View style={{ height: 50 }} />
          <List.Subheader>Données</List.Subheader>
          <Divider />
          {(state.export?.loading || state.delete?.loading) && <ProgressBar indeterminate />}
          {state.delete?.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'la demande de suppression du compte',
                contentPlural: 'Les éléments pour la suppression du compte',
                contentSingular: 'La demande de suppression du compte',
              }}
              error={state.delete?.error}
              retry={deleteAccountFunc}
            />
          )}
          {state.export?.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: "la demande d'exportation de données",
                contentPlural: "Les éléments pour l'exportation de données",
                contentSingular: "La demande d'exportation de données",
              }}
              error={state.export?.error}
            />
          )}
          <List.Item
            title="Exporter mes données"
            onPress={() =>
              Alert.alert(
                'Exporter les données ?',
                "Cette fonction n'est pas encore implémentées, veuillez contacter le DPO pour exporter vos données.",
                [
                  {
                    text: 'Annuler',
                  },
                ],
                { cancelable: true },
              )
            }
          />
          <List.Item
            title="Supprimer mon compte"
            onPress={() => {
              Alert.alert(
                'Supprimer le compte ?',
                'Cette action est irréversible. Vous recevrez un email de confirmation.',
                [
                  {
                    text: 'Annuler',
                  },
                  {
                    text: 'Supprimer',
                    onPress: deleteAccountFunc,
                  },
                ],
                { cancelable: true },
              );
            }}
          />
          <View style={{ height: 50 }} />
          <Divider />
          <View style={styles.container}>
            <Text style={{ color: colors.disabled }}>
              Identifiant {account.accountInfo.accountId}
            </Text>
          </View>
        </View>
      </ScrollView>
      <VisibilityModal visible={isVisibilityVisible} setVisible={setVisibilityVisible} />
      <NameModal visible={isNameVisible} setVisible={setNameVisible} />
      <UsernameModal visible={isUsernameVisible} setVisible={setUsernameVisible} />
      <EmailModal visible={isEmailVisible} setVisible={setEmailVisible} />
      <PasswordModal visible={isPasswordVisible} setVisible={setPasswordVisible} />
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { account, location } = state;
  return {
    account,
    state: account.state,
    location,
  };
};

export default connect(mapStateToProps)(Profile);
