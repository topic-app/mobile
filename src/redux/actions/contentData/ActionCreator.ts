import { AnyAction } from 'redux';
import shortid from 'shortid';

import Store from '@redux/store';
import {
  ApiItemString,
  ListItem,
  ApiItem,
  ArticleReadItem,
  EventReadItem,
  ContentAction,
  AppThunk,
  ContentItemMap,
  ContentItemString,
  EventListItem,
  ArticleListItem,
} from '@ts/types';
import { request } from '@utils/index';

type ContentItemWithListsString = 'articleData' | 'eventData';

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
type AddToListCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  stateUpdate: ContentAction.UpdateStateTypeMap[T];
  resType: ApiItemString;
  url: string;
  params: { [key: string]: any };
  id: string;
  stateName?: ContentAction.UpdateStateNameMap[T];
};

function addToListCreator<T extends ContentItemWithListsString>({
  update,
  stateUpdate,
  dataType,
  resType,
  url,
  params,
  id,
  stateName = 'info',
}: AddToListCreatorParams<T>): AppThunk {
  return (dispatch, getState) => {
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
        const { lists } = getState()[dataType];

        if (
          (lists as (ArticleListItem | EventListItem)[])
            .find((l: ArticleListItem | EventListItem) => l.id === id)
            ?.items.some((i: ApiItem) => i._id === result.data?.[resType][0]?._id)
        ) {
          return;
        }
        dispatch({
          type: update,
          data: (lists as (ArticleListItem | EventListItem)[]).map(
            (l: ArticleListItem | EventListItem) => {
              if (l.id === id) {
                return {
                  ...l,
                  items: [...l.items, result.data?.[resType][0]],
                };
              } else {
                return l;
              }
            },
          ),
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

type RemoveFromListCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  id: string;
  itemId: string;
};

function removeFromListCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  id,
  itemId,
}: RemoveFromListCreatorParams<T>): AnyAction {
  return {
    type: update,
    data: (Store.getState()[dataType].lists as ListItem[]).map((l) => {
      if (l.id === id) {
        return {
          ...l,
          items: (l.items as ApiItem[]).filter((i) => i._id !== itemId),
        };
      } else {
        return l;
      }
    }),
  };
}

type AddListCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  name: string;
  icon?: string;
  description?: string;
};

function addListCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  name,
  icon = 'checkbox-blank-circle',
  description = '',
}: AddListCreatorParams<T>): AnyAction {
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

type ModifyListCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  id: string;
  name?: string;
  icon?: string;
  description?: string;
  items?: ContentItemMap[T][];
};

function modifyListCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  id,
  name,
  icon,
  description,
  items,
}: ModifyListCreatorParams<T>): AnyAction {
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

type DeleteListCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  id: string;
};

function deleteListCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  id,
}: DeleteListCreatorParams<T>): AnyAction {
  return {
    type: update,
    data: (Store.getState()[dataType].lists as ListItem[]).filter((l) => l.id !== id),
  };
}

type AddReadCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  data: ArticleReadItem | EventReadItem;
};

function addReadCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  data,
}: AddReadCreatorParams<T>): AnyAction {
  const { read } = Store.getState()[dataType];
  return {
    type: update,
    data: [...read, data],
  };
}

type DeleteReadCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  id: string;
};
function deleteReadCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  id,
}: DeleteReadCreatorParams<T>): AnyAction {
  return {
    type: update,
    data: Store.getState()[dataType].read.filter((i) => i.id !== id),
  };
}

type ClearReadCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
};
function clearReadCreator<T extends ContentItemWithListsString>({
  dataType,
  update,
}: ClearReadCreatorParams<T>): AnyAction {
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
type UpdateParamsCreatorParams<T extends ContentItemWithListsString> = {
  updateParams: ContentAction.UpdateParamsTypeMap[T];
  params: ContentAction.UpdateParamsDataMap[T];
};
function updateParamsCreator<T extends ContentItemWithListsString>({
  updateParams,
  params,
}: UpdateParamsCreatorParams<T>): AnyAction {
  return {
    type: updateParams,
    data: params,
  };
}

type UpdatePrefsCreatorParams<T extends ContentItemWithListsString> = {
  updatePrefs: ContentAction.UpdatePrefsTypeMap[T];
  prefs: ContentAction.UpdatePrefsDataMap[T];
};
function updatePrefsCreator<T extends ContentItemWithListsString>({
  updatePrefs,
  prefs,
}: UpdatePrefsCreatorParams<T>): AnyAction {
  return {
    type: updatePrefs,
    data: prefs,
  };
}

type AddQuickCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  updateQuicks: ContentAction.UpdateQuicksTypeMap[T];
  type: string;
  id: string;
  title: string;
};
function addQuickCreator<T extends ContentItemWithListsString>({
  updateQuicks,
  dataType,
  type,
  id,
  title,
}: AddQuickCreatorParams<T>): AnyAction {
  const { quicks } = Store.getState()[dataType];
  if (quicks.some((q) => q.id === id)) {
    // Do nothing
    return {
      type: updateQuicks,
      data: quicks,
    };
  }
  return {
    type: updateQuicks,
    data: [...quicks, { id, type, title }],
  };
}

type DeleteQuickCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  updateQuicks: ContentAction.UpdateQuicksTypeMap[T];
  id: string;
};
function deleteQuickCreator<T extends ContentItemWithListsString>({
  updateQuicks,
  dataType,
  id,
}: DeleteQuickCreatorParams<T>): AnyAction {
  return {
    type: updateQuicks,
    data: Store.getState()[dataType].quicks.filter((q) => q.id !== id),
  };
}

type UpdateCreationDataCreatorParams<T extends ContentItemString> = {
  dataType: T;
  updateCreationData: ContentAction.UpdateCreationDataTypeMap[T];
  fields: ContentAction.UpdateCreationDataDataMap[T];
};

function updateCreationDataCreator<T extends ContentItemString>({
  updateCreationData,
  fields,
  dataType,
}: UpdateCreationDataCreatorParams<T>): AnyAction {
  return {
    type: updateCreationData,
    data: { ...Store.getState()[dataType].creationData, ...fields },
  };
}

type ClearCreationDataCreatorParams<T extends ContentItemString> = {
  dataType: T;
  updateCreationData: ContentAction.UpdateCreationDataTypeMap[T];
};
function clearCreationDataCreator<T extends ContentItemString>({
  dataType,
  updateCreationData,
}: ClearCreationDataCreatorParams<T>): AnyAction {
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
