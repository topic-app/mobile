import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Button, Text, Paragraph, useTheme, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from '@components/Avatar';
import { CategoryTitle } from '@components/Typography';
import { InlineCard } from '@components/Cards';
import ErrorMessage from '@components/ErrorMessage';
import getStyles from '@styles/Styles';
import { fetchGroup } from '@redux/actions/api/groups';
import { groupFollow, groupUnfollow } from '@redux/actions/apiActions/groups';
import { fetchAccount } from '@redux/actions/data/account';
import { connect } from 'react-redux';

import {
  GroupPreload,
  Group,
  Account,
  Address,
  GroupRequestState,
  GroupsState,
  State,
} from '@ts/types';

function getAddressString(address: Address) {
  const { number, street, city, code } = address?.address || {};
  if (number && street && city && code) {
    return `${number} ${street}, ${code} ${city}`;
  }
  if (city) return city;
  return null;
}

type GroupElement = Group | GroupPreload;
type GroupDisplayProps = {
  groups: GroupsState;
  account: Account;
  state: GroupRequestState;
};

function GroupDisplay({
  route,
  navigation,
  groups,
  account,
  state,
  accountState,
}: GroupDisplayProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  // Pour changer le type de route.params, voir ../index.tsx
  const { id } = route.params;
  React.useEffect(() => {
    fetchGroup(id);
  }, [null]);

  const group = groups.data.find((g) => g._id === id);

  const following =
    account.loggedIn && account.accountInfo.user.data.following.groups.some((g) => g._id === id);

  const toggleFollow = () => {
    if (following) {
      groupUnfollow(id).then(fetchAccount);
    } else {
      groupFollow(id).then(fetchAccount);
    }
  };

  if (!group) {
    // This is when article has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        {state.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de ce groupe',
              contentSingular: 'Le groupe',
            }}
            error={state.info.error}
            retry={() => fetchGroup(id)}
          />
        )}
        {state.info.loading && <ActivityIndicator size="large" color={colors.primary} />}
      </View>
    );
  }
  return (
    <View style={styles.page}>
      {state.info.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la récupération de ce groupe',
            contentSingular: 'Le groupe',
          }}
          error={state.info.error}
          retry={() => fetchGroup(id)}
        />
      )}
      {state.follow.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la modification du suivi',
            contentSingular: 'le suivi',
          }}
          error={state.info.error}
        />
      )}
      <ScrollView>
        <View style={{ elevation: 3, backgroundColor: colors.surface }}>
          <View style={{ padding: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar avatar={group?.avatar} style={styles.avatar} />
              <View style={{ paddingLeft: 15, flex: 1 }}>
                <Text style={{ fontSize: 22 }} numberOfLines={2}>
                  {`${group?.name} `}
                  {group?.official && <Icon name="check-decagram" size={20} color={colors.icon} />}
                </Text>
                <Text style={{ paddingLeft: 2, color: colors.muted }}>
                  {group?.members?.length} membres &#xFF65; {group?.cache?.followers} abonnés
                </Text>
              </View>
            </View>
            {account.loggedIn && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5 }}>
                {account.groups.some((g) => g._id === id) && (
                  <Button
                    mode="outlined"
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 20,
                      marginRight: 10,
                    }}
                    onPress={() =>
                      Alert.alert(
                        `Quitter le groupe ${group?.name}`,
                        "Vous ne pourrez plus le rejoindre sans l'invitation d'un administrateur du groupe.",
                        [
                          {
                            text: 'Annuler',
                          },
                        ],
                        { cancelable: true },
                      )
                    }
                  >
                    Quitter
                  </Button>
                )}
                <Button
                  loading={state.follow.loading || accountState.loading}
                  mode={following ? 'outlined' : 'contained'}
                  style={{
                    backgroundColor: following ? colors.surface : colors.primary,
                    borderRadius: 20,
                  }}
                  onPress={toggleFollow}
                >
                  {state.follow.loading || accountState.loading
                    ? ''
                    : following
                    ? 'Abonné'
                    : "S'abonner"}
                </Button>
              </View>
            )}
          </View>
        </View>
        {state.info.success && (
          <View>
            <View style={styles.container}>
              <CategoryTitle>Description</CategoryTitle>
              <Paragraph numberOfLines={5}>{group?.summary}</Paragraph>
              {group?.description?.data && (
                // Only show 'Read more' if there is a description
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    activeOpacity={Platform.OS === 'ios' ? 0.2 : 0.6}
                    onPress={() =>
                      navigation.navigate('Description', { title: group.name, id: group._id })
                    }
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ color: colors.disabled, alignSelf: 'center' }}>
                        Voir la description complète
                      </Text>
                      <Icon name="chevron-right" color={colors.disabled} size={23} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Divider />
            {group?.location.global && (
              <InlineCard
                icon="map-marker"
                title="France Entière"
                onPress={() => console.log('global pressed')}
              />
            )}
            {group?.location.schools?.map((school) => (
              <InlineCard
                key={school._id}
                icon="school"
                title={school.displayName}
                subtitle={getAddressString(school?.address) || school?.shortName}
                onPress={() => console.log(`school ${school._id} pressed!`)}
              />
            ))}
            {group?.location.departments?.map((dep) => (
              <InlineCard
                key={dep._id}
                icon="domain"
                title={dep.displayName}
                subtitle="Département"
                onPress={() => console.log(`department ${dep._id} pressed!`)}
              />
            ))}
            <Divider />
            <View style={styles.container}>
              <CategoryTitle>Membres</CategoryTitle>
            </View>
            {group.members?.map((mem) => (
              <InlineCard
                key={mem._id}
                title={mem.user.displayName}
                subtitle={`${mem.user.data?.public ? `@${mem.user.info.username} - ` : ''}${
                  group.roles.find((r) => r._id === mem.role)?.name
                }`}
                badge={mem.role.admin ? 'star' : null}
                badgeColor={colors.solid.gold}
                icon="account"
                onPress={() => console.log(`user ${mem._id} pressed!`)}
              />
            ))}
            <View style={{ height: 40 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { groups, account } = state;
  return {
    groups,
    account,
    state: groups.state,
    accountState: account.state,
  };
};

export default connect(mapStateToProps)(GroupDisplay);
