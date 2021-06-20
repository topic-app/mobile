import shortid from 'shortid';

import Store from '@redux/store';
import {
  UPDATE_EVENTS_QUICKS,
  UPDATE_EVENTS_CREATION_DATA,
  UPDATE_EVENTS_READ,
  UPDATE_EVENTS_STATE,
  UPDATE_EVENTS_PREFS,
  CLEAR_EVENTS,
  Event,
  EventPrefs,
  EventCreationData,
} from '@ts/types';

import { clearCreator } from '../api/ActionCreator';
import {
  addReadCreator,
  deleteReadCreator,
  clearReadCreator,
  updatePrefsCreator,
  addQuickCreator,
  deleteQuickCreator,
  updateCreationDataCreator,
  clearCreationDataCreator,
  reorderQuickCreator,
  deleteReadAllCreator,
} from './ActionCreator';

async function addEventRead(eventId: string, title?: string, marked = false, date?: Date) {
  Store.dispatch(
    addReadCreator({
      update: UPDATE_EVENTS_READ,
      dataType: 'eventData',
      data: { key: shortid(), id: eventId, title, date: date || new Date(), marked },
    }),
  );
}

async function deleteEventRead(key: string) {
  Store.dispatch(
    deleteReadCreator({
      update: UPDATE_EVENTS_READ,
      dataType: 'eventData',
      key,
    }),
  );
}

async function deleteEventReadAll(id: string) {
  Store.dispatch(
    deleteReadAllCreator({
      update: UPDATE_EVENTS_READ,
      dataType: 'eventData',
      id,
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
  addEventRead,
  deleteEventRead,
  deleteEventReadAll,
  clearEventsRead,
  updateEventPrefs,
  addEventQuick,
  reorderEventQuick,
  deleteEventQuick,
  updateEventCreationData,
  clearEventCreationData,
};
