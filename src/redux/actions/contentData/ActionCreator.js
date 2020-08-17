import { request } from "@utils/index";
import Store from "@redux/store";
import shortid from "shortid";

/**
 * @docs actionCreators
 * Créateur d'action pour tout (fetch)
 * @param update L'action a appeller pour mettre a jour la db redux
 * @param stateUpdate L'action a appeller pour mettre à jour l'état de la requête
 * @param url L'url à appeler, sans la base (eg. 'articles/info')
 * @param dataType le type de données, nom de la propriété dans la db redux
 * @param params tous les parametres de la requete
 * @param params.*Id L'id du contenu que l'on veut ajouter a la liste
 * @param listId L'id de la liste à laquelle ajouter l'article
 * @returns Action
 */
function addToListCreator({
  update,
  stateUpdate,
  dataType,
  resType,
  url,
  params,
  id,
  stateName = "info",
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
    request(url, "get", params)
      .then((result) => {
        const { lists } = Store.getState()[dataType];
        if (
          lists
            .find((l) => l.id === id)
            ?.items.some((i) => i._id === result.data[resType][0]?._id)
        ) {
          return;
        }
        dispatch({
          type: update,
          data: lists.map((l) => {
            if (l.id === id) {
              return {
                ...l,
                items: [...l.items, result.data[resType][0]],
              };
            } else {
              return l;
            }
          }),
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

function removeFromListCreator({ update, dataType, id, itemId }) {
  return {
    type: update,
    data: Store.getState()[dataType].lists.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          items: l.items.filter((i) => i._id !== itemId && i.id !== itemId),
        };
      } else {
        return l;
      }
    }),
  };
}

function addListCreator({
  update,
  dataType,
  name,
  icon = "checkbox-blank-circle",
  description = "",
}) {
  return {
    type: update,
    data: [
      ...Store.getState()[dataType].lists,
      {
        id: shortid(),
        name,
        icon,
        description,
        items: [],
      },
    ],
  };
}

function modifyListCreator({
  update,
  dataType,
  id,
  name,
  icon,
  description,
  items,
}) {
  return {
    type: update,
    data: Store.getState()[dataType].lists.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          name: name || l.name,
          icon: icon || l.icon,
          description: description || l.description,
          items: items || l.items,
        };
      } else {
        return l;
      }
    }),
  };
}

function deleteListCreator({ update, dataType, id }) {
  return {
    type: update,
    data: Store.getState()[dataType].lists.filter((l) => l.id !== id),
  };
}

function addReadCreator({ update, dataType, data }) {
  const { read } = Store.getState()[dataType];
  return {
    type: update,
    data: [...read, data],
  };
}

function deleteReadCreator({ update, dataType, id }) {
  return {
    type: update,
    data: Store.getState()[dataType].read.filter((i) => i.id !== id),
  };
}

function clearReadCreator({ update, dataType }) {
  return {
    type: update,
    data: [],
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

function updatePrefsCreator({ updatePrefs, prefs }) {
  return {
    type: updatePrefs,
    data: prefs,
  };
}

function addQuickCreator({ updateQuicks, dataType, type, id, title }) {
  const { quicks } = Store.getState()[dataType];
  if (quicks.some((q) => q.id === id)) {
    return;
  }
  return {
    type: updateQuicks,
    data: [...quicks, { id, type, title }],
  };
}

function deleteQuickCreator({ updateQuicks, dataType, id }) {
  return {
    type: updateQuicks,
    data: Store.getState()[dataType].quicks.filter((q) => q.id !== id),
  };
}

function updateCreationDataCreator({ updateCreationData, fields }) {
  return {
    type: updateCreationData,
    data: fields,
  };
}

function clearCreationDataCreator({ updateCreationData }) {
  return {
    type: updateCreationData,
    data: {},
  };
}

export {
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
};
