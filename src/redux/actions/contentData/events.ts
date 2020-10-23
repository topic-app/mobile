import Store from '@redux/store';

import {
  addToListCreator,
  removeFromListCreator,
  addListCreator,
  modifyListCreator,
  deleteListCreator,
  addReadCreator,
  deleteReadCreator,
  clearReadCreator,
  updateParamsCreator,
  updatePrefsCreator,
  addQuickCreator,
  deleteQuickCreator,
  updateCreationDataCreator,
  clearCreationDataCreator,
} from './ActionCreator';

import {
  UPDATE_EVENTS_QUICKS,
  UPDATE_EVENTS_CREATION_DATA,
  UPDATE_EVENTS_READ,
  UPDATE_EVENTS_LISTS,
  UPDATE_EVENTS_STATE,
  UPDATE_EVENTS_PREFS,
  UPDATE_EVENTS_PARAMS,
  CLEAR_EVENTS,
} from '@ts/types';

import { clearCreator } from '../api/ActionCreator';

/**
 * @docs actions
 * Ajoute un évènement à une list
 * @param eventId L'id de l'évènement à récuperer
 */
async function addEventToList(eventId, listId) {
  await Store.dispatch(
    addToListCreator({
      update: UPDATE_EVENTS_LISTS,
      stateUpdate: UPDATE_EVENTS_STATE,
      url: 'events/info',
      dataType: 'eventData',
      resType: 'events',
      params: { eventId },
      id: listId,
    }),
  );
}

/**
 * @docs actions
 * Enleve un évènement d'une list
 * @param eventId L'id de l'évènement à récuperer
 * @param listId La liste de laquelle il faut enlever l'évènement
 */
async function removeEventFromList(eventId, listId) {
  await Store.dispatch(
    removeFromListCreator({
      update: UPDATE_EVENTS_LISTS,
      dataType: 'eventData',
      itemId: eventId,
      id: listId,
    }),
  );
}

/**
 * @docs actions
 * Ajoute une liste
 * @param name Le nom de la liste
 * @param icon
 * @param description
 */
async function addEventList(name, icon, description) {
  await Store.dispatch(
    addListCreator({
      update: UPDATE_EVENTS_LISTS,
      dataType: 'eventData',
      name,
      icon,
      description,
    }),
  );
}

/**
 * @docs actions
 * Modifie une liste
 * @param listId L'id de la liste
 * @param name Le nom de la liste
 * @param icon
 * @param description
 */
async function modifyEventList(listId, name, icon, description, items) {
  await Store.dispatch(
    modifyListCreator({
      update: UPDATE_EVENTS_LISTS,
      dataType: 'eventData',
      id: listId,
      name,
      icon,
      description,
      items,
    }),
  );
}

/**
 * @docs actions
 * Supprime une liste
 * @param listId L'id de la liste
 */
async function deleteEventList(listId) {
  await Store.dispatch(
    deleteListCreator({
      update: UPDATE_EVENTS_LISTS,
      dataType: 'eventData',
      id: listId,
    }),
  );
}

async function addEventRead(eventId, title, marked = false) {
  await Store.dispatch(
    addReadCreator({
      update: UPDATE_EVENTS_READ,
      dataType: 'eventData',
      data: { id: eventId, title, date: new Date(), marked },
    }),
  );
}

async function deleteEventRead(eventId) {
  await Store.dispatch(
    deleteReadCreator({
      update: UPDATE_EVENTS_READ,
      dataType: 'eventData',
      id: eventId,
    }),
  );
}

async function clearEventsRead() {
  await Store.dispatch(
    clearReadCreator({
      update: UPDATE_EVENTS_READ,
      dataType: 'eventData',
    }),
  );
}

/**
 * @docs actions
 * Change les parametres de requete pour un évènement
 * @param eventId L'id de l'évènement à récuperer
 */
async function updateEventParams(params) {
  await Store.dispatch(
    updateParamsCreator({
      updateParams: UPDATE_EVENTS_PARAMS,
      params,
    }),
  );
  await Store.dispatch(
    clearCreator({
      clear: CLEAR_EVENTS,
    }),
  );
}

async function updateEventPrefs(prefs) {
  await Store.dispatch(
    updatePrefsCreator({
      updatePrefs: UPDATE_EVENTS_PREFS,
      prefs,
    }),
  );
}

async function addEventQuick(type, id, title) {
  await Store.dispatch(
    addQuickCreator({
      updateQuicks: UPDATE_EVENTS_QUICKS,
      dataType: 'eventData',
      type,
      id,
      title,
    }),
  );
}

async function deleteEventQuick(id) {
  await Store.dispatch(
    deleteQuickCreator({
      updateQuicks: UPDATE_EVENTS_QUICKS,
      dataType: 'eventData',
      id,
    }),
  );
}

async function updateEventCreationData(fields) {
  await Store.dispatch(
    updateCreationDataCreator({
      updateCreationData: UPDATE_EVENTS_CREATION_DATA,
      dataType: 'eventData',
      fields,
    }),
  );
}

async function clearEventCreationData() {
  await Store.dispatch(
    clearCreationDataCreator({
      updateCreationData: UPDATE_EVENTS_CREATION_DATA,
    }),
  );
}

export {
  addEventToList,
  removeEventFromList,
  addEventList,
  modifyEventList,
  deleteEventList,
  addEventRead,
  deleteEventRead,
  clearEventsRead,
  updateEventParams,
  updateEventPrefs,
  addEventQuick,
  deleteEventQuick,
  updateEventCreationData,
  clearEventCreationData,
};
