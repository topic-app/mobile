import request from '@utils/request';
import Store from '@redux/store';

/**
 * @docs actionCreators
 * Créateur d'action pour updatePetitions
 * @param next Si il faut récupérer les petitions après le dernier
 * @returns Action
 */
function updatePetitionsCreator(type = 'initial', params = {}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    dispatch({
      type: 'UPDATE_PETITIONS_STATE',
      data: {
        loading: {
          initial: type === 'initial',
          refresh: type === 'refresh',
          next: type === 'next',
          petition: getState().petitions.state.loading.petition,
        },
        success: null,
        error: null,
      },
    });
    if (type === 'next') {
      const petitions = getState().petitions.data;
      // petitions.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
      lastId = petitions[petitions.length - 1]._id;
      number = 5;
    }
    request('petitions/list', 'get', { lastId, number, ...params })
      .then((result) => {
        if (result.success) {
          const { data } = getState().petitions; // The old petitions, in redux db
          result.data.petitions.forEach((a) => {
            const petition = { ...a, preload: true };
            if (data.some((p) => p._id === a._id)) {
              data[data.map((p) => p._id).indexOf(a._id)] = petition;
            } else {
              data.push(petition);
            }
          });
          data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
          dispatch({
            type: 'UPDATE_PETITIONS',
            data,
          });
          return dispatch({
            type: 'UPDATE_PETITIONS_STATE',
            data: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
                petition: getState().petitions.state.loading.petition,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`Error, ${result}`);
        return dispatch({
          type: 'UPDATE_PETITIONS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              petition: getState().petitions.state.loading.petition,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: 'UPDATE_PETITIONS_STATE',
          data: {
            loading: {
              initial: false,
              refresh: false,
              next: false,
              petition: getState().petitions.state.loading.petition,
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
 * Créateur d'action pour fetchPetition
 * @param petitionId L'id de l'petition que l'on veut chercher
 * @returns Action
 */
function fetchPetitionCreator(petitionId) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_PETITIONS_STATE',
      data: {
        loading: {
          initial: getState().petitions.state.loading.initial,
          refresh: getState().petitions.state.loading.refresh,
          next: getState().petitions.state.loading.next,
          petition: true,
        },
        success: null,
        error: null,
      },
    });
    request('petitions/info', 'get', { petitionId })
      .then((result) => {
        const { petitions } = result.data;
        const petition = petitions[0];
        const { data } = getState().petitions; // The old petitions, in redux db
        if (data.some((p) => p._id === petition._id)) {
          data[data.map((p) => p._id).indexOf(petition._id)] = petition;
        } else {
          data.push(petition);
        }
        data.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
        if (result.success) {
          dispatch({
            type: 'UPDATE_PETITIONS',
            data,
          });
          return dispatch({
            type: 'UPDATE_PETITIONS_STATE',
            data: {
              loading: {
                initial: getState().petitions.state.loading.initial,
                refresh: getState().petitions.state.loading.refresh,
                next: getState().petitions.state.loading.next,
                petition: false,
              },
              success: true,
              error: null,
            },
          });
        }
        console.log(`ERROR: ${result}`);
        return dispatch({
          type: 'UPDATE_PETITIONS_STATE',
          data: {
            loading: {
              initial: getState().petitions.state.loading.initial,
              refresh: getState().petitions.state.loading.refresh,
              next: getState().petitions.state.loading.next,
              petition: false,
            },
            success: false,
            error: 'server',
          },
        });
      })
      .catch((err) => {
        console.log(`ERROR: ${err}`);
        return dispatch({
          type: 'UPDATE_PETITIONS_STATE',
          data: {
            loading: {
              initial: getState().petitions.state.loading.initial,
              refresh: getState().petitions.state.loading.refresh,
              next: getState().petitions.state.loading.next,
              petition: false,
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
 * Créateur d'action pour clearPetitions
 * @returns Action
 */
function clearPetitionsCreator() {
  return {
    type: 'CLEAR_PETITIONS',
  };
}

/**
 * @docs actions
 * Récupère les infos basiques petitions depuis le serveur
 * @param next Si il faut récupérer les petitions après le dernier
 */
function updatePetitions(type, params) {
  return Store.dispatch(updatePetitionsCreator(type, params));
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul petition
 * @param petitionId L'id de l'petition à récuperer
 */
function fetchPetition(petitionId) {
  return Store.dispatch(fetchPetitionCreator(petitionId));
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearPetitions() {
  return Store.dispatch(clearPetitionsCreator());
}

export { updatePetitions, clearPetitions, fetchPetition };
