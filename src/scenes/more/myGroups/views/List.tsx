import React from 'react';
import PropTypes from 'prop-types';
import { View, SectionList } from 'react-native';
import { Text, ProgressBar, Divider, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import { CategoryTitle } from '@components/Typography';
import { connect } from 'react-redux';
import Illustration from '@components/Illustration';
import { updateGroups } from '@redux/actions/api/groups';
import { fetchGroups } from '@redux/actions/data/account';
import ErrorMessage from '@components/ErrorMessage';
import GroupListCard from '../components/Card';

function MyGroupsList({ navigation, account, groups, state, accountState }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  React.useEffect(() => {
    updateGroups('initial');
    fetchGroups();
  }, [null]);

  const data = [
    // Groups where the user is a member
    {
      key: 'members',
      title: 'Membre',
      data: account.groups || [],
    },
    {
      key: 'following',
      title: 'Suivis',
      data:
        account.accountInfo?.user.data.following.groups.filter(
          (g) => !account.groups?.some((h) => h._id === g._id),
        ) || [],
    },
    {
      key: 'location',
      title: 'Recommendés',
      data:
        groups.data?.filter(
          (g) =>
            !account.groups?.some((h) => h._id === g._id) &&
            !account.accountInfo?.user.data.following.groups.some((h) => h._id === g._id),
        ) || [],
    },
  ];

  return (
    <View style={styles.page}>
      {state.list.loading.initial ||
        (accountState.fetchGroups.loading && (
          <ProgressBar indeterminate style={{ marginTop: -4 }} />
        ))}
      {state.list.error || accountState.fetchGroups.error ? (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la récupération des groupes',
            contentPlural: 'des groupes',
            contentSingular: 'La liste de groupes',
          }}
          error={[state.list.error, accountState.fetchGroups.error]}
          retry={() => {
            updateGroups('initial');
            fetchGroups();
          }}
        />
      ) : null}
      <SectionList
        sections={data}
        /*
        refreshing={state.loading.refresh}
        onRefresh={() => updateArticles('refresh')}
        onEndReached={() => updateArticles('next')}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
          {state.loading.next && <ActivityIndicator size="large" color={colors.primary} />}
          </View>
        }
        */
        ListHeaderComponent={() => (
          <View>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="group" height={200} width={200} />
              <View style={[styles.contentContainer, { alignItems: 'center' }]}>
                <Text>
                  Rejoignez des groupes pour représenter vos clubs, associations et organisations et
                  pour écrire du contenu.
                </Text>
              </View>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title, data } }) =>
          data.length !== 0 ? (
            <View style={{ marginTop: 10 }}>
              <Divider />
              <CategoryTitle style={{ paddingTop: 13, paddingLeft: 15 }}>{title}</CategoryTitle>
            </View>
          ) : (
            <View />
          )
        }
        ListFooterComponent={<View style={[styles.container, { height: 50 }]} />}
        renderItem={({ item }) => (
          <>
            <GroupListCard
              group={item}
              following={account.accountInfo?.user.data.following.groups.some(
                (g) => g._id === item._id,
              )}
              member={account.groups?.some((g) => g._id === item._id)}
              navigate={() =>
                navigation.navigate('Main', {
                  screen: 'Display',
                  params: {
                    screen: 'Group',
                    params: {
                      screen: 'Display',
                      params: { id: item._id, title: item.name },
                    },
                  },
                })
              }
            />
          </>
        )}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  const { account, groups } = state;
  return {
    account,
    groups,
    state: groups.state,
    accountState: account.state,
  };
};

export default connect(mapStateToProps)(MyGroupsList);

MyGroupsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
