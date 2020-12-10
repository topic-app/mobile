import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';

import {
  State,
  EventPreload,
  Account,
  GroupRolePermission,
  EventRequestState,
  Event,
  EventVerificationPreload,
  AccountPermission,
} from '@ts/types';
import { useTheme } from '@utils/index';
import {
  CustomTabView,
  ChipAddList,
  ErrorMessage,
  EventCard,
  TranslucentStatusBar,
  CustomHeaderBar,
} from '@components/index';
import getStyles from '@styles/Styles';
import { updateEventsVerification } from '@redux/actions/api/events';

import type { ModerationStackParams } from '../index';
import getModerationStyles from '../styles/Styles';

type Props = {
  navigation: StackNavigationProp<ModerationStackParams, 'List'>;
  eventsVerification: EventVerificationPreload[];
  account: Account;
  state: EventRequestState;
};

const ModerationEvents: React.FC<Props> = ({ navigation, eventsVerification, account, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (!account.loggedIn) return null;

  console;

  const allowedGroupsEvent = account.permissions.reduce(
    (groups: string[], p: AccountPermission) => {
      if (p.permission === 'event.verification.view') {
        return [...groups, ...(p.scope.self ? [p.group] : []), ...p.scope.groups];
      } else {
        return groups;
      }
    },
    [],
  );
  const allowedEverywhereEvent = account.permissions.some(
    (p) => p.permission === 'event.verification.view' && p.scope.everywhere,
  );
  const [selectedGroupsEvent, setSelectedGroupsEvent] = React.useState(allowedGroupsEvent);
  const [everywhereEvent, setEverywhereEvent] = React.useState(false);

  const fetch = (groups = selectedGroupsEvent, everywhere = everywhereEvent) =>
    updateEventsVerification('initial', everywhere ? {} : { groups });

  React.useEffect(() => {
    fetch();
  }, [null]);

  return (
    <View>
      {state.verification_list?.loading.initial && <ProgressBar indeterminate />}
      {state.verification_list?.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la récupération des évènements à vérifier',
            contentSingular: "La liste d'évènements à vérifier",
            contentPlural: 'Les évènements à vérifier',
          }}
          error={state.verification_list.error}
          retry={fetch}
        />
      )}
      <View>
        <ChipAddList
          setList={(data) => {
            if (data.key === 'everywhere') {
              setEverywhereEvent(true);
              setSelectedGroupsEvent([]);
              fetch([], true);
            } else {
              if (selectedGroupsEvent.includes(data.key)) {
                setEverywhereEvent(false);
                setSelectedGroupsEvent(selectedGroupsEvent.filter((g) => g !== data.key));
                fetch(
                  selectedGroupsEvent.filter((g) => g !== data.key),
                  false,
                );
              } else {
                setEverywhereEvent(false);
                setSelectedGroupsEvent([...selectedGroupsEvent, data.key]);
                fetch([...selectedGroupsEvent, data.key], false);
              }
            }
          }}
          data={[
            ...(allowedEverywhereEvent
              ? [{ key: 'everywhere', title: 'Tous (France entière)' }]
              : []),
            ...allowedGroupsEvent.map((g: string) => ({
              key: g,
              title:
                account.groups?.find((h) => h._id === g)?.shortName ||
                account.groups?.find((h) => h._id === g)?.name ||
                'Groupe inconnu',
            })),
          ]}
          keyList={[...selectedGroupsEvent, ...(everywhereEvent ? ['everywhere'] : [])]}
        />
        <FlatList
          data={eventsVerification}
          keyExtractor={(i) => i._id}
          ListEmptyComponent={
            state.verification_list?.loading?.initial ? null : (
              <View style={styles.centerIllustrationContainer}>
                <Text>Aucun évènement en attente de modération</Text>
              </View>
            )
          }
          renderItem={({ item }: { item: EventVerificationPreload }) => (
            <View>
              <EventCard
                event={item}
                verification
                navigate={() =>
                  navigation.navigate('Main', {
                    screen: 'Display',
                    params: {
                      screen: 'Event',
                      params: {
                        screen: 'Display',
                        params: {
                          id: item._id,
                          title: item.title,
                          useLists: false,
                          verification: true,
                        },
                      },
                    },
                  })
                }
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { events, account } = state;
  return {
    eventsVerification: events.verification,
    account,
    state: events.state,
  };
};

export default connect(mapStateToProps)(ModerationEvents);
