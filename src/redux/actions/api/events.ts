import Store from '@redux/store';
import {
  UPDATE_EVENTS_UPCOMING_DATA,
  UPDATE_EVENTS_VERIFICATION,
  UPDATE_EVENTS_PASSED_DATA,
  UPDATE_EVENTS_SEARCH,
  UPDATE_EVENTS_ITEM,
  UPDATE_EVENTS_STATE,
  CLEAR_EVENTS,
  UPDATE_EVENTS_FOLLOWING,
  UPDATE_EVENTS_MY_INFO,
} from '@ts/redux';
import { Event, ApiItem } from '@ts/types';
import { getContentParams } from '@utils';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const dateAscSort = (data: ApiItem[]) =>
  (data as Event[]).sort((a, b) =>
    new Date(a.duration?.start) > new Date(b.duration?.start) ? 1 : -1,
  );

const dateDescSort = (data: Event[]) =>
  data.sort((a, b) => (new Date(a.duration?.start) > new Date(b.duration?.start) ? -1 : 1));

/**
 * @docs actions
 * Récupère les infos basiques events depuis le serveur
 * @param next Si il faut récupérer les events après le dernier
 */
async function updateUpcomingEvents(
  type: 'initial' | 'refresh' | 'next',
  params = {},
  useDefaultParams = true,
) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_EVENTS_UPCOMING_DATA,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: 'events/list',
      listName: 'dataUpcoming',
      sort: dateAscSort,
      dataType: 'events',
      type,
      params: useDefaultParams
        ? { ...getContentParams(), durationEndRangeStart: Date.now(), ...params }
        : params,
    }),
  );
}

async function updatePassedEvents(
  type: 'initial' | 'refresh' | 'next',
  params = {},
  useDefaultParams = true,
) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_EVENTS_PASSED_DATA,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: 'events/list',
      listName: 'dataPassed',
      sort: dateDescSort,
      dataType: 'events',
      type,
      params: useDefaultParams
        ? { ...getContentParams(), durationStartRangeEnd: Date.now(), ...params }
        : params,
    }),
  );
}

async function updateEventsFollowing(
  type: 'initial' | 'refresh' | 'next',
  params = {},
  useDefaultParams = true,
) {
  if (
    !Store.getState().account.loggedIn ||
    !Store.getState().account?.accountInfo?.user?.data?.following?.groups?.every((g) => !g)
  ) {
    return false;
  }
  await Store.dispatch(
    updateCreator({
      update: UPDATE_EVENTS_FOLLOWING,
      stateUpdate: UPDATE_EVENTS_STATE,
      stateName: 'following',
      url: 'events/list',
      listName: 'following',
      sort: dateDescSort,
      dataType: 'events',
      type,
      params: useDefaultParams
        ? {
            groups: Store.getState()
              .account?.accountInfo?.user?.data?.following?.groups?.map((g) => g._id)
              .filter((g) => !!g),
            users: Store.getState()
              .account?.accountInfo?.user?.data?.following?.users?.map((u) => u._id)
              .filter((g) => !!g),
            ...params,
          }
        : params,
    }),
  );
}

async function searchEvents(
  type: 'initial' | 'refresh' | 'next',
  terms: string,
  params = {},
  search = true,
  useDefaultParams = false,
) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_EVENTS_SEARCH,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: 'events/list',
      dataType: 'events',
      type,
      params: useDefaultParams
        ? { ...getContentParams(), ...params, search, terms }
        : { ...params, search, terms },
      stateName: 'search',
      listName: 'search',
      clear: type !== 'next',
    }),
  );
}
/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul event
 * @param eventId L'id de l'event à récuperer
 */
async function fetchEvent(eventId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_EVENTS_ITEM,
      stateUpdate: UPDATE_EVENTS_STATE,
      stateName: 'info',
      url: 'events/info',
      dataType: 'events',
      params: { eventId },
    }),
  );
}

async function fetchEventMy(contentId: string) {
  if (!Store.getState().account.loggedIn) {
    return;
  }
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_EVENTS_MY_INFO,
      stateUpdate: UPDATE_EVENTS_STATE,
      stateName: 'my',
      url: 'profile/myContentInfo',
      dataType: 'infos' as 'events',
      params: { contentId },
      auth: true,
    }),
  );
}

/** Event verification */
async function fetchEventVerification(eventId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_EVENTS_ITEM,
      stateUpdate: UPDATE_EVENTS_STATE,
      stateName: 'info',
      url: 'events/verification/info',
      dataType: 'events',
      params: { eventId },
      auth: true,
    }),
  );
}

async function updateEventsVerification(
  type: 'initial' | 'refresh' | 'next',
  params = {},
  clear = true,
) {
  if (clear) {
    await Store.dispatch(
      clearCreator({
        clear: CLEAR_EVENTS,
        verification: true,
      }),
    );
  }
  await Store.dispatch(
    updateCreator({
      update: UPDATE_EVENTS_VERIFICATION,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: 'events/verification/list',
      dataType: 'events',
      type,
      params,
      stateName: 'verification_list',
      listName: 'verification',
      clear: type !== 'next',
      auth: true,
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearEvents(data = true, search = true) {
  Store.dispatch(clearCreator({ clear: CLEAR_EVENTS, data, search }));
}

export {
  updateUpcomingEvents,
  updatePassedEvents,
  clearEvents,
  fetchEvent,
  fetchEventMy,
  searchEvents,
  updateEventsFollowing,
  fetchEventVerification,
  updateEventsVerification,
};
