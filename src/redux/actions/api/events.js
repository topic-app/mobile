import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updateEvents
 * @param next Si il faut récupérer les events après le dernier
 * @returns Action
 */
function updateEventsCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_EVENTS_STATE',
      data: {
        list: {
          loading: {
            initial: type === 'initial',
            refresh: type === 'refresh',
            next: type === 'next',
          },
          success: null,
          error: null,
        },
      },
    });
    if (type === 'next') {
      const events = getState().events.data;
      // events.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = events[events.length - 1]._id;
      number = 5;
    }
    request('events/list', 'get', { lastId, number, ...params })
      .then((result) => {
        const { data } = getState().events; // The old events, in redux db
        result.data.events.forEach((a) => {
          const event = { ...a, preload: true };
          if (data.some((p) => p._id === a._id)) {
            data[data.map((p) => p._id).indexOf(a._id)] = event;
          } else {
            data.push(event);
          }
        });
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        dispatch({
          type: 'UPDATE_EVENTS',
          data,
        });
        return dispatch({
          type: 'UPDATE_EVENTS_STATE',
          data: {
            list: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
              },
              success: true,
              error: null,
            },
          },
        });
      })
      .catch((error) => {
        return dispatch({
          type: 'UPDATE_EVENTS_STATE',
          data: {
            list: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
              },
              success: false,
              error,
            },
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour fetchEvent
 * @param eventId L'id de l'event que l'on veut chercher
 * @returns Action
 */
function fetchEventCreator(eventId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_EVENTS_STATE',
      data: {
        info: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    request('events/info', 'get', { eventId })
      .then((result) => {
        const { events } = result.data;
        const event = events[0];
        const { data } = getState().events; // The old events, in redux db
        if (data.some((p) => p._id === event._id)) {
          data[data.map((p) => p._id).indexOf(event._id)] = event;
        } else {
          data.push(event);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        dispatch({
          type: 'UPDATE_EVENTS',
          data,
        });
        return dispatch({
          type: 'UPDATE_EVENTS_STATE',
          data: {
            info: {
              loading: false,
              success: true,
              error: null,
            },
          },
        });
      })
      .catch((error) => {
        return dispatch({
          type: 'UPDATE_EVENTS_STATE',
          data: {
            info: {
              loading: false,
              success: false,
              error,
            },
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour clearEvents
 * @returns Action
 */
function clearEventsCreator() {
  return {
    type: 'CLEAR_EVENTS',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques events depuis le serveur
 * @param next Si il faut récupérer les events après le dernier
 */
function updateEvents(type, params) {
  return Store.dispatch(updateEventsCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul event
 * @param eventId L'id de l'event à récuperer
 */
function fetchEvent(eventId) {
  return Store.dispatch(fetchEventCreator(eventId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearEvents() {
  return Store.dispatch(clearEventsCreator());
}

export { updateEvents, clearEvents, fetchEvent };
