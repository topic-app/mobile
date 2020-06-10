import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data) => data; // .sort((a, b) => a?.name?.localCompare(b?.name));

/**
 * @docs actions
 * Récupère les infos basiques schools depuis le serveur
 * @param next Si il faut récupérer les schools après le dernier
 */
function updateSchools(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_SCHOOLS',
      stateUpdate: 'UPDATE_SCHOOLS_STATE',
      url: 'schools/list',
      sort: nameAscSort,
      dataType: 'schools',
      type,
      params,
      listName: 'data',
    }),
  );
}

function searchSchools(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_SCHOOLS', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_SCHOOLS_SEARCH',
      stateUpdate: 'UPDATE_SCHOOLS_STATE',
      url: 'schools/list',
      dataType: 'schools',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
      listName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul school
 * @param schoolId L'id de l'school à récuperer
 */
function fetchSchool(schoolId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_SCHOOLS',
      stateUpdate: 'UPDATE_SCHOOLS_STATE',
      url: 'schools/list',
      sort: nameAscSort,
      dataType: 'schools',
      params: { schoolId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearSchools() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_SCHOOLS' }));
}

export { updateSchools, clearSchools, fetchSchool, searchSchools };
