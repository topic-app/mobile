import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import groups from '@src/data/groupListData.json';
import { CategoryTitle } from '@components/Typography';
import GroupListCard from '../components/Card';

function MyGroupsList({ navigation }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const members = groups.filter((g) => g.userInfo.isMember);
  const newGroups = [
    // Put member groups at the top
    ...members,
    ...groups.filter((g) => !g.userInfo.isMember),
  ];

  return (
    <View style={styles.page}>
      <FlatList
        data={newGroups}
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
        ListFooterComponent={<View style={[styles.container, { height: 50 }]} />}
        keyExtractor={(group) => group._id}
        renderItem={({ item, index }) => {
          let title = null;
          if (members.length !== 0 && index === 0) {
            title = 'Membre';
          } else if (index === members.length) {
            title = 'Suivi';
          }
          return (
            <>
              {title && (
                <CategoryTitle style={{ paddingTop: 13, paddingLeft: 15 }}>{title}</CategoryTitle>
              )}
              <GroupListCard
                group={item}
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
          );
        }}
      />
    </View>
  );
}

export default MyGroupsList;

MyGroupsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
