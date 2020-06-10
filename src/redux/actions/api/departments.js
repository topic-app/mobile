import Store from '@redux/store';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data) => data; // .sort((a, b) => a.name.localCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques departments depuis le serveur
 * @param next Si il faut récupérer les departments après le dernier
 */
function updateDepartments(type, params) {
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_DEPARTMENTS',
      stateUpdate: 'UPDATE_DEPARTMENTS_STATE',
      url: 'departments/list',
      sort: nameAscSort,
      dataType: 'departments',
      type,
      params,
      listName: 'data',
    }),
  );
}

function searchDepartments(type, terms, params) {
  if (type !== 'next') Store.dispatch(clearCreator({ clear: 'CLEAR_DEPARTMENTS', data: false }));
  return Store.dispatch(
    updateCreator({
      update: 'UPDATE_DEPARTMENTS_SEARCH',
      stateUpdate: 'UPDATE_DEPARTMENTS_STATE',
      url: 'departments/list',
      dataType: 'departments',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
      listName: 'search',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul department
 * @param departmentId L'id de l'department à récuperer
 */
function fetchDepartment(departmentId) {
  return Store.dispatch(
    fetchCreator({
      update: 'UPDATE_DEPARTMENTS',
      stateUpdate: 'UPDATE_DEPARTMENTS_STATE',
      url: 'departments/list',
      sort: nameAscSort,
      dataType: 'departments',
      params: { departmentId },
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
function clearDepartments() {
  return Store.dispatch(clearCreator({ clear: 'CLEAR_DEPARTMENTS' }));
}

export { updateDepartments, clearDepartments, fetchDepartment, searchDepartments };
