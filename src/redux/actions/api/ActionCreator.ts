import { request, logger } from '@utils/index';
import {
  State,
  Item,
  ElementStringPlural,
  ElementStringPluralMap,
  DepartmentsState,
  SchoolsState,
} from '@ts/types';

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
type updateCreatorProps = {
  update: string;
  stateUpdate: string;
  url: string;
  sort?: (data: Item[]) => Item[];
  dataType: ElementStringPlural;
  stateName?: string;
  type?: string;
  params?: object;
  listName?: string;
  clear?: boolean;
  initialNum?: number;
  nextNum?: number;
  auth?: boolean;
};

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
  clear = false,
  nextNum = 10,
  initialNum = 20,
  auth = false,
}: updateCreatorProps) {
  return (dispatch: (action: any) => void, getState: () => State) => {
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
      if (elements.length !== 0) {
        lastId = elements[elements.length - 1]._id;
        number = nextNum;
      } else {
        logger.warn(
          `Warning: Requested state update type 'next' in updateCreator but no elements were found in redux db '${dataType}'`,
        );
      }
    }
    request(url, 'get', { lastId, number, ...params }, auth)
      .then((result) => {
        let data: Array<Item>;
        if (!clear) {
          const dbData = getState()[dataType][listName] || []; // The old elements, in redux db // to actually have type, add as Array<ElementStringPluralMap[typeof dataType]>
          data = [...dbData]; // Shallow copy of dbData to get rid of reference
          if (result.data) {
            result.data[dataType].forEach((a: Item) => {
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
        console.error(error);
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
type fetchCreatorProps = {
  update: string;
  stateUpdate: string;
  dataType: ElementStringPlural;
  url: string;
  params: object;
  stateName?: string;
  useArray?: boolean;
  auth?: boolean;
};
function fetchCreator({
  update,
  stateUpdate,
  dataType,
  url,
  params,
  stateName = 'info',
  useArray = false,
  auth = false,
}: fetchCreatorProps) {
  return (dispatch: (action: any) => void, getState: () => State) => {
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
          const data = result.data && result.data[dataType][0];
          dispatch({
            type: update,
            data: useArray
              ? [
                  ...((getState()[dataType] as SchoolsState | DepartmentsState)?.items || []),
                  ...((getState()[dataType] as SchoolsState | DepartmentsState)?.items?.includes(
                    data?._id,
                  )
                    ? []
                    : [data]),
                ] // HACK: Whatever
              : data,
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

/**
 * @docs actionCreators
 * Créateur d'action pour tout clear
 * @param clear L'action pour clear la db
 * @param data Si il faut effacer la liste d'articles
 * @param search Si il faut effacer la recherche d'articles
 * @returns Action
 */
function clearCreator({
  clear,
  data = true,
  search = true,
  verification = true,
}: {
  clear: string;
  data: boolean;
  search: boolean;
  verification?: boolean;
}) {
  return {
    type: clear,
    data: {
      search,
      data,
      verification,
    },
  };
}

export { updateCreator, fetchCreator, clearCreator };
