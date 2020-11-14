import { request } from '@utils/index';
import Store from '@redux/store';
import shortid from 'shortid';
import {
  ElementStringPlural,
  ElementDataString,
  State,
  ListItem,
  Article,
  Item,
  ArticlePrefs,
  ArticleParams,
  EventParams,
  EventPrefs,
  ArticleCreationData,
  EventCreationData,
  ArticleReadItem,
  EventReadItem,
  GroupCreationData,
} from '@ts/types';

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
type addToListProps = {
  update: string;
  stateUpdate: string;
  dataType: 'articleData' | 'eventData';
  resType: ElementStringPlural;
  url: string;
  params: object;
  id: string;
  stateName?: string;
};

function addToListCreator({
  update,
  stateUpdate,
  dataType,
  resType,
  url,
  params,
  id,
  stateName = 'info',
}: addToListProps) {
  return (dispatch: (action: any) => void, getState: () => State) => {
    dispatch({
      type: stateUpdate,
      data: {
        [stateName]: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    request(url, 'get', params)
      .then((result) => {
        const { lists }: { lists: ListItem[] } = getState()[dataType];
        if (
          lists
            .find((l) => l.id === id)
            ?.items.some((i: Item) => i._id === result.data?.[resType][0]?._id)
        ) {
          return;
        }
        dispatch({
          type: update,
          data: lists.map((l) => {
            if (l.id === id) {
              return {
                ...l,
                items: [...l.items, result.data?.[resType][0]],
              };
            } else {
              return l;
            }
          }),
        });
        return dispatch({
          type: stateUpdate,
          data: {
            [stateName]: {
              loading: false,
              success: true,
              error: null,
            },
          },
        });
      })
      .catch((err) => {
        return dispatch({
          type: stateUpdate,
          data: {
            [stateName]: {
              loading: false,
              success: false,
              error: err,
            },
          },
        });
      });
  };
}

type removeFromListProps = {
  update: string;
  dataType: 'articleData' | 'eventData';
  id: string;
  itemId: string;
};

function removeFromListCreator({ update, dataType, id, itemId }: removeFromListProps) {
  return {
    type: update,
    data: (Store.getState()[dataType].lists as ListItem[]).map((l) => {
      if (l.id === id) {
        return {
          ...l,
          items: (l.items as Item[]).filter((i) => i._id !== itemId),
        };
      } else {
        return l;
      }
    }),
  };
}

type addListProps = {
  update: string;
  dataType: 'articleData' | 'eventData';
  name: string;
  icon?: string;
  description?: string;
};

function addListCreator({
  update,
  dataType,
  name,
  icon = 'checkbox-blank-circle',
  description = '',
}: addListProps) {
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

type modifyListProps = {
  update: string;
  dataType: 'articleData' | 'eventData';
  id: string;
  name?: string;
  icon?: string;
  description?: string;
  items?: Item[];
};
function modifyListCreator({
  update,
  dataType,
  id,
  name,
  icon,
  description,
  items,
}: modifyListProps) {
  return {
    type: update,
    data: (Store.getState()[dataType].lists as ListItem[]).map((l) => {
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

type deleteListProps = {
  update: string;
  dataType: 'articleData' | 'eventData';
  id: string;
};
function deleteListCreator({ update, dataType, id }: deleteListProps) {
  return {
    type: update,
    data: (Store.getState()[dataType].lists as ListItem[]).filter((l) => l.id !== id),
  };
}

type addReadProps = {
  update: string;
  dataType: 'eventData' | 'articleData';
  data: ArticleReadItem | EventReadItem;
};
function addReadCreator({ update, dataType, data }: addReadProps) {
  const { read } = Store.getState()[dataType];
  return {
    type: update,
    data: [...read, data],
  };
}

type deleteReadProps = {
  update: string;
  dataType: 'articleData' | 'eventData';
  id: string;
};
function deleteReadCreator({ update, dataType, id }: deleteReadProps) {
  return {
    type: update,
    data: Store.getState()[dataType].read.filter((i) => i.id !== id),
  };
}

type clearReadProps = {
  update: string;
  dataType: 'articleData' | 'eventData';
};
function clearReadCreator({ update, dataType }: clearReadProps) {
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
type updateParamsProps = {
  updateParams: string;
  params: Partial<ArticleParams | EventParams>;
};
function updateParamsCreator({ updateParams, params }: updateParamsProps) {
  return {
    type: updateParams,
    data: params,
  };
}

type updatePrefsProps = {
  updatePrefs: string;
  prefs: Partial<ArticlePrefs | EventPrefs>;
};
function updatePrefsCreator({ updatePrefs, prefs }: updatePrefsProps) {
  return {
    type: updatePrefs,
    data: prefs,
  };
}

type addQuickProps = {
  updateQuicks: string;
  dataType: 'articleData' | 'eventData';
  type: string;
  id: string;
  title: string;
};
function addQuickCreator({ updateQuicks, dataType, type, id, title }: addQuickProps) {
  const { quicks } = Store.getState()[dataType];
  if (quicks.some((q) => q.id === id)) {
    return;
  }
  return {
    type: updateQuicks,
    data: [...quicks, { id, type, title }],
  };
}

type deleteQuickProps = {
  updateQuicks: string;
  dataType: 'articleData' | 'eventData';
  id: string;
};
function deleteQuickCreator({ updateQuicks, dataType, id }: deleteQuickProps) {
  return {
    type: updateQuicks,
    data: Store.getState()[dataType].quicks.filter((q) => q.id !== id),
  };
}

type updateCreationDataProps = {
  updateCreationData: string;
  fields: Partial<ArticleCreationData | EventCreationData | GroupCreationData>;
  dataType: 'articleData' | 'eventData' | 'groupData';
};
function updateCreationDataCreator({
  updateCreationData,
  fields,
  dataType,
}: updateCreationDataProps) {
  return {
    type: updateCreationData,
    data: { ...Store.getState()[dataType].creationData, ...fields },
  };
}

type clearCreationDataProps = {
  updateCreationData: string;
};
function clearCreationDataCreator({ updateCreationData }: clearCreationDataProps) {
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
