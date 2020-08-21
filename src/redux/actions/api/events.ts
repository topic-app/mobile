import Store from '@redux/store';
import { Event } from '@ts/types';
import {
  UPDATE_EVENTS_DATA,
  UPDATE_EVENTS_SEARCH,
  UPDATE_EVENTS_ITEM,
  UPDATE_EVENTS_STATE,
  CLEAR_EVENTS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const dateAscSort = (data: Event[]) =>
  data.sort((a, b) => (new Date(a.duration?.start) > new Date(b.duration?.start) ? 1 : -1));

/**
 * @docs actions
 * Récupère les infos basiques events depuis le serveur
 * @param next Si il faut récupérer les events après le dernier
 */
async function updateEvents(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_EVENTS_DATA,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: '/events/list',
      sort: dateAscSort,
      dataType: 'events',
      type,
      params,
    }),
  );
}

async function searchEvents(type: 'initial' | 'refresh' | 'next', terms: string, params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_EVENTS_SEARCH,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: '/events/list',
      dataType: 'events',
      type,
      params: { ...params, search: true, terms },
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

/**
 * @docs actions
 * Vide la database redux complètement
 */
async function clearEvents(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_EVENTS, data, search }));
}

export { updateEvents, clearEvents, fetchEvent, searchEvents };