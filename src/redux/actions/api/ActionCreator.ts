import {
  ApiItemString,
  ApiItemMap,
  DepartmentsState,
  SchoolsState,
  ApiAction,
  ApiStateMap,
  AppThunk,
} from '@ts/types';
import { request, logger } from '@utils/index';
import { AnyAction } from 'redux';

type UpdateCreatorParams<T extends ApiItemString> = {
  dataType: T;
  update: ApiAction.TypeMap[T];
  stateUpdate: ApiAction.UpdateStateTypeMap[T];
  listName: keyof ApiStateMap[T];
  url: string;
  stateName?: ApiAction.UpdateStateNameMap[T];
  sort?: (data: ApiItemMap[T][]) => ApiItemMap[T][];
  type?: 'initial' | 'next' | 'refresh';
  params?: { [key: string]: any };
  clear?: boolean;
  initialNum?: number;
  nextNum?: number;
  auth?: boolean;
};

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
function updateCreator<T extends ApiItemString>({
  update,
  stateUpdate,
  url,
  sort = (data) => data,
  dataType,
  stateName = 'list',
  type = 'initial',
  params = {},
  listName,
  clear = false,
  nextNum = 10,
  initialNum = 20,
  auth = false,
}: UpdateCreatorParams<T>): AppThunk {
  type Element = ApiItemMap[T];
  return (dispatch, getState) => {
    let lastId;
    let number = initialNum;
    dispatch({
      type: stateUpdate,
      data: {
        [stateName]: {
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
      const elements = getState()[dataType][listName];
      if (Array.isArray(elements) && elements.length !== 0) {
        lastId = elements[elements.length - 1]._id;
        number = nextNum;
      } else {
        logger.warn(
          `updateCreator: Failed to get next elements of db: getState()[${dataType}][${listName}] is not an array or is an empty array`,
        );
        return dispatch({
          type: stateUpdate,
          data: {
            [stateName]: {
              loading: {
                initial: false,
                refresh: false,
                next: false,
              },
              success: false,
              error: {
                success: false,
                reason: 'redux',
                status: null,
                error: `updateCreator: Failed to update db: getState()[${dataType}][${listName}] is not an array`,
              },
            },
          },
        });
      }
    }
    request(url, 'get', { lastId, number, ...params }, auth)
      .then((result) => {
        let data: Element[];
        if (!clear) {
          const dbData = getState()[dataType][listName];
          if (!Array.isArray(dbData)) {
            logger.warn(
              `updateCreator: Failed to update db: getState()[${dataType}][${listName}] is not an array`,
            );
            return dispatch({
              type: stateUpdate,
              data: {
                [stateName]: {
                  loading: {
                    initial: false,
                    refresh: false,
                    next: false,
                  },
                  success: false,
                  error: {
                    success: false,
                    reason: 'redux',
                    status: null,
                    error: `updateCreator: Failed to update db: getState()[${dataType}][${listName}] is not an array`,
                  },
                },
              },
            });
          }
          data = [...dbData]; // Shallow copy of dbData to get rid of reference
          if (result.data) {
            result.data[dataType].forEach((a: Element) => {
              const element = { ...a, preload: true };
              const index = data.findIndex((p) => p._id === a._id);
              if (index !== -1) {
                data[index] = element;
              } else {
                data.push(element);
              }
            });
          }
          data = sort(data);
        } else {
          data = result.data ? result.data[dataType] : [];
        }
        dispatch({
          type: update,
          data,
        });
        return dispatch({
          type: stateUpdate,
          data: {
            [stateName]: {
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
        logger.error(error);
        return dispatch({
          type: stateUpdate,
          data: {
            [stateName]: {
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

type FetchCreatorParams<T extends ApiItemString> = {
  dataType: T;
  url: string;
  update: ApiAction.TypeMap[T];
  stateUpdate: ApiAction.UpdateStateTypeMap[T];
  stateName: ApiAction.UpdateStateNameMap[T];
  params: { [key: string]: any };
  useArray?: boolean;
  auth?: boolean;
};

/**
 * @docs actionCreators
 * Créateur d'action pour tout (fetch)
 * @param update L'action a appeller pour mettre a jour la db redux
 * @param stateUpdate L'action a appeller pour mettre à jour l'état de la requête
 * @param url L'url à appeler, sans la base (eg. 'articles/list')
 * @param dataType le type de données, nom de la propriété dans la db redux
 * @param params tous les parametres de la requete
 * @param params.*Id L'id du contenu que l'on veut récupérer
 * @returns Action
 */
function fetchCreator<T extends ApiItemString>({
  update,
  stateUpdate,
  dataType,
  url,
  params,
  stateName,
  useArray = false,
  auth = false,
}: FetchCreatorParams<T>): AppThunk {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
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
      request(url, 'get', params, auth)
        .then((result) => {
          let data = result.data?.[dataType][0];
          const state = getState()[dataType];

          if (useArray && Array.isArray((state as SchoolsState | DepartmentsState).items)) {
            data = (state as SchoolsState | DepartmentsState).items;
            // Push data to state if it's not already in it
            if (!data.includes(data?._id)) {
              data.push(data);
            }
          }

          dispatch({
            type: update,
            data,
          });
          dispatch({
            type: stateUpdate,
            data: {
              [stateName]: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve();
        })
        .catch((err) => {
          dispatch({
            type: stateUpdate,
            data: {
              [stateName]: {
                loading: false,
                success: false,
                error: err,
              },
            },
          });
          reject();
        });
    });
  };
}

type ClearCreatorParams<T extends ApiItemString> = ApiAction.ClearDataMap[T] & {
  clear: ApiAction.ClearTypeMap[T];
};

/**
 * @docs actionCreators
 * Créateur d'action pour tout clear
 * @param clear L'action pour clear la db
 * @param data Si il faut effacer la liste d'articles
 * @param search Si il faut effacer la recherche d'articles
 * @returns Action
 */
function clearCreator<T extends ApiItemString>({
  clear,
  ...elementsToClear
}: ClearCreatorParams<T>): AnyAction {
  return {
    type: clear,
    data: elementsToClear,
  };
}

export { updateCreator, fetchCreator, clearCreator };
