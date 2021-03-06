import randomColor from 'randomcolor';
import React from 'react';
import { View, ScrollView, FlatList, Platform } from 'react-native';
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
import shortid from 'shortid';

import {
  Avatar,
  CollapsibleView,
  ErrorMessage,
  InlineCard,
  PageContainer,
  TranslucentStatusBar,
  VerificationBanner,
} from '@components';
import { fetchAccount, logout, deleteAccount, fetchEmail } from '@redux/actions/data/account';
import { updateAvatar } from '@redux/actions/data/profile';
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
import { logger, Alert, messaging } from '@utils';

import type { ProfileScreenNavigationProp } from '.';
import BioModal from './components/BioModal';
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
  const [isBioVisible, setBioVisible] = React.useState(false);
  const [isEmailVisible, setEmailVisible] = React.useState(false);
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);

  React.useEffect(() => {
    fetchAccount();
    fetchEmail();
  }, []);

  const generateAvatars = () =>
    ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].map((i) => {
      return {
        type: 'gradient',
        gradient: {
          start: randomColor({ hue: i }),
          end: randomColor(),
          angle: Math.floor(Math.random() * 90 + 1),
        },
      };
    });

  const [avatars, setAvatars] = React.useState(generateAvatars());
  const [avatarsVisible, setAvatarsVisible] = React.useState(false);

  if (!account.loggedIn) return <Text>Non autoris??</Text>;

  const deleteAccountFunc = () => {
    deleteAccount().then(() =>
      Alert.alert(
        'V??rifiez vos emails',
        `Un lien de confirmation ?? ??t?? envoy?? ?? ${account.accountInfo?.email || 'votre email'}.`,
        [{ text: 'Fermer' }],
        { cancelable: true },
      ),
    );
  };

  const addAvatars = () => setAvatars([...avatars, ...generateAvatars()]);

  return (
    <PageContainer
      headerOptions={{ title: 'Compte' }}
      loading={account.state.fetchAccount.loading}
      showError={account.state.fetchAccount.error || account.state.fetchEmail.error}
      errorOptions={{
        type: 'axios',
        strings: {
          what: 'la mise ?? jour du profil',
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
            <Avatar
              size={120}
              avatar={account.accountInfo?.user.info.avatar}
              onPress={() => setAvatarsVisible(!avatarsVisible)}
              editing
            />
          </View>
          <CollapsibleView collapsed={!avatarsVisible}>
            <Divider />
            <FlatList
              data={avatars}
              horizontal
              onEndReachedThreshold={0.5}
              onEndReached={addAvatars}
              renderItem={({ item }) => {
                return (
                  <View style={{ borderRadius: 55, margin: 10 }}>
                    <Avatar
                      size={100}
                      onPress={() =>
                        updateAvatar({
                          type: 'gradient',
                          gradient: item.gradient,
                          text: account.accountInfo?.user.info.username.substring(0, 1) || '',
                        }).then(() => fetchAccount())
                      }
                      avatar={{
                        type: 'gradient',
                        gradient: item.gradient,
                        text: account.accountInfo?.user.info.username.substring(0, 1) || '',
                      }}
                    />
                  </View>
                );
              }}
            />
            <Divider />
          </CollapsibleView>
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
            item="Visibilit??"
            value={account.accountInfo.user.data.public ? 'Public' : 'Priv??'}
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
                value={genName(account.accountInfo.user) || 'Non sp??cifi??'}
                editable
                disabled={!genName(account.accountInfo.user)}
                type="public"
                onPress={() => setNameVisible(true)}
              />
              <ProfileItem
                item="Biographie"
                value={account.accountInfo.user?.data?.description || 'Non sp??cifi??'}
                editable
                disabled={!account.accountInfo.user?.data?.description}
                small={!!account.accountInfo.user?.data?.description}
                type="public"
                onPress={() => setBioVisible(true)}
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
            {location.global && <InlineCard icon="map-marker" title="France Enti??re" />}
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
              />
            ))}
            {location.departmentData?.map((dep) => (
              <InlineCard
                key={dep._id}
                icon="map-marker-radius"
                title={dep.name}
                subtitle={`${dep.type === 'departement' ? 'D??partement' : 'R??gion'}`}
              />
            ))}
            <View style={styles.container}>
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.push('Main', {
                    screen: 'More',
                    params: { screen: 'Settings', params: { screen: 'SelectLocation' } },
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
            title="Activer l'Authentification ?? deux facteurs"
            titleStyle={{ color: colors.disabled }}
            onPress={() => {}}
          />
          <List.Item
            title="Se d??connecter"
            titleStyle={{ color: 'red' }}
            onPress={() => {
              navigation.popToTop();
              Alert.alert(
                'Se d??connecter ?',
                "Les listes et l'historique seront toujours disponibles sur votre t??l??phone",
                [
                  {
                    text: 'Annuler',
                  },
                  {
                    text: 'Se d??connecter',
                    onPress: () => {
                      logout();
                    },
                  },
                ],
                { cancelable: true },
              );
            }}
          />
          <View style={{ height: 50 }} />
          <List.Subheader>Donn??es</List.Subheader>
          <Divider />
          {(state.export?.loading || state.delete?.loading) && <ProgressBar indeterminate />}
          {state.delete?.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'la demande de suppression du compte',
                contentPlural: 'Les ??l??ments pour la suppression du compte',
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
                what: "la demande d'exportation de donn??es",
                contentPlural: "Les ??l??ments pour l'exportation de donn??es",
                contentSingular: "La demande d'exportation de donn??es",
              }}
              error={state.export?.error}
            />
          )}
          <List.Item
            title="Exporter mes donn??es"
            onPress={() =>
              Alert.alert(
                'Exporter les donn??es ?',
                "Cette fonction n'est pas encore impl??ment??es, veuillez contacter le DPO pour exporter vos donn??es.",
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
                'Cette action est irr??versible. Vous recevrez un email de confirmation.',
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
      <BioModal visible={isBioVisible} setVisible={setBioVisible} />
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
