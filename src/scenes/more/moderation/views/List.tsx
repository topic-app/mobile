import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomTabView, TranslucentStatusBar, CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import { State, Account } from '@ts/types';
import { useTheme } from '@utils/index';

import ModerationArticles from '../components/ModerationArticles';
import ModerationEvents from '../components/ModerationEvents';
import ModerationGroups from '../components/ModerationGroups';
import type { ModerationScreenNavigationProp } from '../index';

type Props = {
  navigation: ModerationScreenNavigationProp<'List'>;
  account: Account;
};

const ModerationList: React.FC<Props> = ({ navigation, account }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (!account.loggedIn) {
    return <Text>Non autorisé</Text>;
  }

  const allowedArticles = account.permissions.some(
    (p) => p.permission === 'article.verification.view',
  );
  const allowedEvents = account.permissions.some((p) => p.permission === 'event.verification.view');

  const allowedGroups = account.permissions.some((p) => p.permission === 'group.verification.view');

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Modération',
            },
          },
        }}
      />
      <ScrollView>
        <CustomTabView
          pages={[
            ...(allowedArticles
              ? [
                  {
                    key: 'articles',
                    title: 'Articles',
                    component: <ModerationArticles navigation={navigation} />,
                  },
                ]
              : []),
            ...(allowedEvents
              ? [
                  {
                    key: 'events',
                    title: 'Évènements',
                    component: <ModerationEvents navigation={navigation} />,
                  },
                ]
              : []),
            ...(allowedGroups
              ? [
                  {
                    key: 'groups',
                    title: 'Groupes',
                    component: <ModerationGroups navigation={navigation} />,
                  },
                ]
              : []),
          ]}
        />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articles, account } = state;
  return {
    account,
  };
};

export default connect(mapStateToProps)(ModerationList);
