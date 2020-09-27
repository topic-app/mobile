import Store from '@redux/store';
import { Event } from '@ts/types';
import {
  UPDATE_EVENTS_UPCOMING_DATA,
  UPDATE_EVENTS_VERIFICATION,
  UPDATE_EVENTS_PASSED_DATA,
  UPDATE_EVENTS_SEARCH,
  UPDATE_EVENTS_ITEM,
  UPDATE_EVENTS_STATE,
  CLEAR_EVENTS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const dateAscSort = (data: Event[]) =>
  data.sort((a, b) => (new Date(a.duration?.start) > new Date(b.duration?.start) ? 1 : -1));

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
      sort: dateAscSort,
      dataType: 'events',
      type,
      params: useDefaultParams
        ? { ...Store.getState().eventData.params, durationEndRangeStart: Date.now(), ...params }
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
      sort: dateDescSort,
      dataType: 'events',
      type,
      params: useDefaultParams
        ? { ...Store.getState().eventData.params, durationStartRangeEnd: Date.now(), ...params }
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
  console.log(`Search articles ${JSON.stringify(params)}`);
  await Store.dispatch(
    updateCreator({
      update: UPDATE_EVENTS_SEARCH,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: 'events/list',
      dataType: 'events',
      type,
      params: useDefaultParams
        ? { ...Store.getState().eventData.params, ...params, search, terms }
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
      url: 'events/info',
      dataType: 'events',
      params: { eventId },
    }),
  );
}

/** Event verification **/

async function fetchEventVerification(eventId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_EVENTS_ITEM,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: 'events/verification/info',
      dataType: 'events',
      params: { eventId },
      auth: true,
    }),
  );
}

async function updateEventsVerification(type: 'initial' | 'refresh' | 'next', params = {}) {
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
async function clearEvents(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_EVENTS, data, search }));
}

export {
  updateUpcomingEvents,
  updatePassedEvents,
  clearEvents,
  fetchEvent,
  searchEvents,
  fetchEventVerification,
  updateEventsVerification,
};
