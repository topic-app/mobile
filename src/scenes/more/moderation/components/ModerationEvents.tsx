import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { ChipAddList, ErrorMessage, EventCard } from '@components';
import { Permissions } from '@constants';
import { updateEventsVerification } from '@redux/actions/api/events';
import getStyles from '@styles/global';
import {
  State,
  Account,
  EventRequestState,
  EventVerificationPreload,
  ModerationTypes,
} from '@ts/types';
import { checkPermission, getPermissionGroups } from '@utils';

import type { ModerationScreenNavigationProp } from '..';

type Props = {
  navigation: ModerationScreenNavigationProp<'List'>;
  eventsVerification: EventVerificationPreload[];
  account: Account;
  state: EventRequestState;
  type: ModerationTypes;
};

const ModerationEvents: React.FC<Props> = ({
  navigation,
  eventsVerification,
  account,
  state,
  type,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const allowedGroupsEvent = getPermissionGroups(account, Permissions.EVENT_VERIFICATION_VIEW);
  const allowedEverywhereEvent = checkPermission(account, {
    permission: Permissions.EVENT_VERIFICATION_VIEW,
    scope: { everywhere: true },
  });
  const [selectedGroupsEvent, setSelectedGroupsEvent] = React.useState(
    type === 'unverified' || !allowedEverywhereEvent ? allowedGroupsEvent : [],
  );
  const [everywhereEvent, setEverywhereEvent] = React.useState(
    type === 'unverified' ? false : allowedEverywhereEvent,
  );

  const fetch = (groups = selectedGroupsEvent, everywhere = everywhereEvent) =>
    updateEventsVerification('initial', { ...(everywhere ? {} : { groups }), type });

  React.useEffect(() => {
    if (account.loggedIn) fetch();
  }, [null]);

  if (!account.loggedIn) return null;

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
