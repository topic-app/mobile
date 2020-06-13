import request from '@utils/request';

/**
 * @docs actionCreators
 * Créateur d'action pour tout (update)
 * @param update L'action a appeller pour mettre a jour la db redux
 * @param stateUpdate L'action a appeller pour mettre à jour l'état de la requête
 * @param url L'url à appeler, sans la base (eg. 'articles/list')
 * @param sort Une fonction pour trier les données
 * @param dataType le type de données, nom de la propriété dans la db redux
 * @param type Le type de chargement
 * @param params tous les parametres de la requete
 *
 * @returns Action
 */
function updateCreator({
  update,
  stateUpdate,
  url,
  sort = (data) => data,
  dataType,
  stateName = 'list',
  type = 'initial',
  params = {},
  listName = 'data',
}) {
  return (dispatch, getState) => {
    let lastId;
    let number = 10;
    const state = {
      type: stateUpdate,
      data: {},
    };
    state.data[stateName] = {
      loading: {
        initial: type === 'initial',
        refresh: type === 'refresh',
        next: type === 'next',
      },
      success: null,
      error: null,
    };
    dispatch(state);
    if (type === 'next') {
      const elements = getState()[dataType][listName];
      if (elements.length !== 0) {
        lastId = elements[elements.length - 1]._id;
        number = 5;
      } else {
        console.log(
          `Warning: Requested state update type 'next' in updateCreator but no elements were found in redux db '${dataType}'`,
        );
      }
    }
    request(url, 'get', { lastId, number, ...params })
      .then((result) => {
        const dbData = getState()[dataType][listName] || []; // The old elements, in redux db
        let data = [...dbData]; // Shallow copy of dbData to get rid of reference
        result.data[dataType].forEach((a) => {
          const element = { ...a, preload: true };
          const index = data.findIndex((p) => p._id === a._id);
          if (index !== -1) {
            data[index] = element;
          } else {
            data.push(element);
          }
        });
        data = sort(data);
        dispatch({
          type: update,
          data,
        });
        state.data[stateName] = {
          loading: {
            initial: false,
            refresh: false,
            next: false,
          },
          success: true,
          error: null,
        };
        return dispatch(state);
      })
      .catch((error) => {
        state.data[stateName] = {
          loading: {
            initial: false,
            refresh: false,
            next: false,
          },
          success: false,
          error,
        };
        return dispatch(state);
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour tout (fetch)
 * @param update L'action a appeller pour mettre a jour la db redux
 * @param stateUpdate L'action a appeller pour mettre à jour l'état de la requête
 * @param url L'url à appeler, sans la base (eg. 'articles/list')
 * @param sort Une fonction pour trier les données
 * @param dataType le type de données, nom de la propriété dans la db redux
 * @param params tous les parametres de la requete
 * @param params.*Id L'id du contenu que l'on veut récupérer
 * @returns Action
 */
function fetchCreator({
  update,
  stateUpdate,
  sort = (data) => data,
  dataType,
  url,
  params,
  stateName = 'info',
}) {
  return (dispatch, getState) => {
    const state = {
      type: stateUpdate,
      data: {},
    };
    state.data[stateName] = {
      loading: true,
      success: null,
      error: null,
    };
    dispatch(state);
    request(url, 'get', params)
      .then((result) => {
        const elements = result.data[dataType];
        const element = elements[0];
        const dbData = getState()[dataType].data || []; // The old elements, in redux db
        let data = [...dbData]; // Shallow copy of dbData to get rid of reference
        const index = data.findIndex((p) => p._id === element._id);
        if (index !== -1) {
          data[index] = element;
        } else {
          data.push(element);
        }
        data = sort(data);
        dispatch({
          type: update,
          data,
        });
        state.data[stateName] = {
          loading: false,
          success: true,
          error: null,
        };
        return dispatch(state);
      })
      .catch((err) => {
        state.data[stateName] = {
          loading: false,
          success: false,
          error: err,
        };
        return dispatch(state);
      });
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour mettre à jour les paramètres de requete
 * @param updateParams L'action pour clear la db
 * @param params Les paramètres à mettre à jour
 * @returns Action
 */
function updateParamsCreator({ updateParams, params }) {
  return {
    type: updateParams,
    data: params,
  };
}

/**
 * @docs actionCreators
 * Créateur d'action pour tout clear
 * @param clear L'action pour clear la db
 * @param data Si il faut effacer la liste d'articles
 * @param search Si il faut effacer la recherche d'articles
 * @returns Action
 */
function clearCreator({ clear, data = true, search = true }) {
  return {
    type: clear,
    data: {
      search,
      data,
    },
  };
}

export { updateCreator, fetchCreator, clearCreator, updateParamsCreator };
