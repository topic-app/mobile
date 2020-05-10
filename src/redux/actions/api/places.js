import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updatePlaces
 * @param next Si il faut récupérer les places après le dernier
 * @returns Action
 */
function updatePlacesCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_PLACES_STATE',
      data: {
        loading: {
          initial: type === 'initial',
          refresh: type === 'refresh',
          next: type === 'next',
          place: getState().places.state.loading.place,
        },
        success: null,
        error: null,
      },
    });
    if (type === 'next') {
      const places = getState().places.data;
      // places.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = places[places.length - 1]._id;
      number = 5;
    }
    request('places/list', 'get', { lastId, number, ...params })
      .then((result) => {
        if (result.success) {
          const { data } = getState().places; // The old places, in redux db
          result.data.places.forEach((a) => {
            const place = { ...a, preload: true };
            if (data.some((p) => p._id === a._id)) {
              data[data.map((p) => p._id).indexOf(a._id)] = place;
            } else {
              data.push(place);
            }
          });
          data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
          dispatch({
            type: 'UPDATE_PLACES',
            data,
          });
          return dispatch({
            type: 'UPDATE_PLACES_STATE',
            data: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
                place: getState().places.state.loading.place,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`Error, ${result}`);
        return dispatch({
          type: 'UPDATE_PLACES_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              place: getState().places.state.loading.place,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_PLACES_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              place: getState().places.state.loading.place,
            },
            success: false,
            error: err,
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour fetchPlace
 * @param placeId L'id de l'place que l'on veut chercher
 * @returns Action
 */
function fetchPlaceCreator(placeId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_PLACES_STATE',
      data: {
        loading: {
          initial: getState().places.state.loading.initial,
          refresh: getState().places.state.loading.refresh,
          next: getState().places.state.loading.next,
          place: true,
        },
        success: null,
        error: null,
      },
    });
    request('places/info', 'get', { placeId })
      .then((result) => {
        const { places } = result.data;
        const place = places[0];
        const { data } = getState().places; // The old places, in redux db
        if (data.some((p) => p._id === place._id)) {
          data[data.map((p) => p._id).indexOf(place._id)] = place;
        } else {
          data.push(place);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        if (result.success) {
          dispatch({
            type: 'UPDATE_PLACES',
            data,
          });
          return dispatch({
            type: 'UPDATE_PLACES_STATE',
            data: {
              loading: {
                initial: getState().places.state.loading.initial,
                refresh: getState().places.state.loading.refresh,
                next: getState().places.state.loading.next,
                place: false,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`ERROR: ${result}`);
        return dispatch({
          type: 'UPDATE_PLACES_STATE',
          data: {
            loading: {
              initial: getState().places.state.loading.initial,
              refresh: getState().places.state.loading.refresh,
              next: getState().places.state.loading.next,
              place: false,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        console.log(`ERROR: ${err}`);
        return dispatch({
          type: 'UPDATE_PLACES_STATE',
          data: {
            loading: {
              initial: getState().places.state.loading.initial,
              refresh: getState().places.state.loading.refresh,
              next: getState().places.state.loading.next,
              place: false,
            },
            success: false,
            error: err,
          },
        });
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour clearPlaces
 * @returns Action
 */
function clearPlacesCreator() {
  return {
    type: 'CLEAR_PLACES',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques places depuis le serveur
 * @param next Si il faut récupérer les places après le dernier
 */
function updatePlaces(type, params) {
  return Store.dispatch(updatePlacesCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul place
 * @param placeId L'id de l'place à récuperer
 */
function fetchPlace(placeId) {
  return Store.dispatch(fetchPlaceCreator(placeId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearPlaces() {
  return Store.dispatch(clearPlacesCreator());
}

export { updatePlaces, clearPlaces, fetchPlace };
