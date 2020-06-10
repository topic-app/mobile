import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const dateAscSort = (data) =>
  data.sort((a, b) => (new Date(a.duration?.start) > new Date(b.duration?.start) ? 1 : -1));

/**
 * @docs actions
 * Récupère les infos basiques events depuis le serveur
 * @param next Si il faut récupérer les events après le dernier
 */
function updateEvents(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_EVENTS',
      stateUpdate: 'UPDATE_EVENTS_STATE',
      url: 'events/list',
      sort: dateAscSort,
      dataType: 'events',
      type,
      params,
    }),
  );
}

function searchEvents(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_EVENTS', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_EVENTS_SEARCH',
      stateUpdate: 'UPDATE_EVENTS_STATE',
      url: 'events/list',
      dataType: 'events',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul event
 * @param eventId L'id de l'event à récuperer
 */
function fetchEvent(eventId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_EVENTS',
      stateUpdate: 'UPDATE_EVENTS_STATE',
      url: 'events/list',
      sort: dateAscSort,
      dataType: 'events',
      params: { eventId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearEvents() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_EVENTS' }));
}

export { updateEvents, clearEvents, fetchEvent, searchEvents };
