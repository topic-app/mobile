import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { CustomTabView, TranslucentStatusBar, CustomHeaderBar } from '@components/index';
import { Permissions } from '@constants/index';
import getStyles from '@styles/Styles';
import { State, Account } from '@ts/types';
import { checkPermission, useTheme } from '@utils/index';

import ModerationArticles from '../components/ModerationArticles';
import ModerationEvents from '../components/ModerationEvents';
import ModerationGroups from '../components/ModerationGroups';
import type { ModerationScreenNavigationProp, ModerationStackParams } from '../index';

type Props = StackScreenProps<ModerationStackParams, 'List'> & {
  navigation: ModerationScreenNavigationProp<'List'>;
  account: Account;
};

const ModerationList: React.FC<Props> = ({ navigation, account, route }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const type = route.params?.type || 'unverified';

  if (!account.loggedIn) {
    return <Text>Non autorisé</Text>;
  }

  const allowedArticles = checkPermission(account, {
    permission: Permissions.ARTICLE_VERIFICATION_VIEW,
    scope: {},
  });
  const allowedEvents = checkPermission(account, {
    permission: Permissions.EVENT_VERIFICATION_VIEW,
    scope: {},
  });

  const allowedGroups = checkPermission(account, {
    permission: Permissions.GROUP_VERIFICATION_VIEW,
    scope: {},
  });

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Modération',
              overflow:
                type !== 'unverified'
                  ? undefined
                  : [
                      {
                        title: 'Vérification supplémentaire',
                        onPress: () => navigation.push('List', { type: 'extra' }),
                      },
                      {
                        title: 'Contenus signalés',
                        onPress: () => navigation.push('List', { type: 'reported' }),
                      },
                      {
                        title: 'Remis en modération',
                        onPress: () => navigation.push('List', { type: 'deverified' }),
                      },
                    ],
            },
          },
        }}
      />
      <View style={styles.centeredPage}>
        <ScrollView>
          {['deverified', 'extra', 'reported'].includes(type) && (
            <View style={styles.container}>
              <Card
                elevation={0}
                style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
              >
                <View style={[styles.container, { flexDirection: 'row', alignItems: 'center' }]}>
                  <Icon
                    name={
                      {
                        deverified: 'shield',
                        extra: 'alert-decagram',
                        reported: 'message-alert',
                        unverified: 'shield',
                      }[type]
                    }
                    style={{ alignSelf: 'center', marginRight: 10 }}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={{ color: colors.text, flex: 1 }}>
                    {
                      {
                        deverified: 'Contenus remis en modération',
                        extra: 'Contenus nécéssitant une vérification supplémentaire',
                        reported: 'Contenus signalés',
                        unverified: '',
                      }[type]
                    }
                  </Text>
                </View>
              </Card>
            </View>
          )}
          <CustomTabView
            pages={[
              ...(allowedArticles
                ? [
                    {
                      key: 'articles',
                      title: 'Articles',
                      component: <ModerationArticles navigation={navigation} type={type} />,
                    },
                  ]
                : []),
              ...(allowedEvents
                ? [
                    {
                      key: 'events',
                      title: 'Évènements',
                      component: <ModerationEvents navigation={navigation} type={type} />,
                    },
                  ]
                : []),
              ...(allowedGroups && type !== 'deverified'
                ? [
                    {
                      key: 'groups',
                      title: 'Groupes',
                      component: <ModerationGroups navigation={navigation} type={type} />,
                    },
                  ]
                : []),
            ]}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return {
    account,
  };
};

export default connect(mapStateToProps)(ModerationList);
