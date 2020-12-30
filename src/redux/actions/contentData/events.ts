import Store from '@redux/store';
import {
  UPDATE_EVENTS_QUICKS,
  UPDATE_EVENTS_CREATION_DATA,
  UPDATE_EVENTS_READ,
  UPDATE_EVENTS_LISTS,
  UPDATE_EVENTS_STATE,
  UPDATE_EVENTS_PREFS,
  UPDATE_EVENTS_PARAMS,
  CLEAR_EVENTS,
  Event,
  EventParams,
  EventPrefs,
  EventCreationData,
} from '@ts/types';

import { clearCreator } from '../api/ActionCreator';
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
  reorderQuickCreator,
  reorderListCreator,
} from './ActionCreator';

/**
 * @docs actions
 * Ajoute un évènement à une list
 * @param eventId L'id de l'évènement à récuperer
 */
async function addEventToList(eventId: string, listId: string) {
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
async function removeEventFromList(eventId: string, listId: string) {
  Store.dispatch(
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
async function addEventList(name: string, icon: string = '', description: string = '') {
  Store.dispatch(
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
async function modifyEventList(
  listId: string,
  name: string,
  icon: string | undefined,
  description?: string,
  items?: Event[],
) {
  Store.dispatch(
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

async function reorderEventList(from: string, to: string) {
  Store.dispatch(
    reorderListCreator({
      update: UPDATE_EVENTS_LISTS,
      dataType: 'eventData',
      from,
      to,
    }),
  );
}

/**
 * @docs actions
 * Supprime une liste
 * @param listId L'id de la liste
 */
async function deleteEventList(listId: string) {
  Store.dispatch(
    deleteListCreator({
      update: UPDATE_EVENTS_LISTS,
      dataType: 'eventData',
      id: listId,
    }),
  );
}

async function addEventRead(eventId: string, title: string, marked = false) {
  Store.dispatch(
    addReadCreator({
      update: UPDATE_EVENTS_READ,
      dataType: 'eventData',
      data: { id: eventId, title, date: new Date(), marked },
    }),
  );
}

async function deleteEventRead(eventId: string) {
  Store.dispatch(
    deleteReadCreator({
      update: UPDATE_EVENTS_READ,
      dataType: 'eventData',
      id: eventId,
    }),
  );
}

async function clearEventsRead() {
  Store.dispatch(
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
async function updateEventParams(params: Partial<EventParams>) {
  Store.dispatch(
    updateParamsCreator({
      updateParams: UPDATE_EVENTS_PARAMS,
      params,
    }),
  );
  Store.dispatch(
    clearCreator({
      clear: CLEAR_EVENTS,
    }),
  );
}

async function updateEventPrefs(prefs: Partial<EventPrefs>) {
  Store.dispatch(
    updatePrefsCreator({
      updatePrefs: UPDATE_EVENTS_PREFS,
      prefs,
    }),
  );
}

async function addEventQuick(type: string, id: string, title: string) {
  Store.dispatch(
    addQuickCreator({
      updateQuicks: UPDATE_EVENTS_QUICKS,
      dataType: 'eventData',
      type,
      id,
      title,
    }),
  );
}

async function reorderEventQuick(from: string, to: string) {
  Store.dispatch(
    reorderQuickCreator({
      updateQuicks: UPDATE_EVENTS_QUICKS,
      dataType: 'eventData',
      from,
      to,
    }),
  );
}

async function deleteEventQuick(id: string) {
  Store.dispatch(
    deleteQuickCreator({
      updateQuicks: UPDATE_EVENTS_QUICKS,
      dataType: 'eventData',
      id,
    }),
  );
}

async function updateEventCreationData(fields: Partial<EventCreationData>) {
  Store.dispatch(
    updateCreationDataCreator({
      updateCreationData: UPDATE_EVENTS_CREATION_DATA,
      dataType: 'eventData',
      fields,
    }),
  );
}

async function clearEventCreationData() {
  Store.dispatch(
    clearCreationDataCreator({
      dataType: 'eventData',
      updateCreationData: UPDATE_EVENTS_CREATION_DATA,
    }),
  );
}

export {
  addEventToList,
  removeEventFromList,
  addEventList,
  modifyEventList,
  reorderEventList,
  deleteEventList,
  addEventRead,
  deleteEventRead,
  clearEventsRead,
  updateEventParams,
  updateEventPrefs,
  addEventQuick,
  reorderEventQuick,
  deleteEventQuick,
  updateEventCreationData,
  clearEventCreationData,
};
