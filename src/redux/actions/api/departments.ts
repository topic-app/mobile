import Store from '@redux/store';
import { UPDATE_DEPARTMENTS_ITEMS, ApiItem, Department } from '@ts/types';
import {
  UPDATE_DEPARTMENTS_DATA,
  UPDATE_DEPARTMENTS_STATE,
  UPDATE_DEPARTMENTS_SEARCH,
  UPDATE_DEPARTMENTS_ITEM,
  CLEAR_DEPARTMENTS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data: Department[]) => data; // .sort((a, b) => a.name.localCompare(b.name));

/**
 * @docs actions
 * Récupère les infos basiques departments depuis le serveur
 * @param next Si il faut récupérer les departments après le dernier
 */
async function updateDepartments(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_DEPARTMENTS_DATA,
      stateUpdate: UPDATE_DEPARTMENTS_STATE,
      url: 'departments/list',
      sort: nameAscSort,
      dataType: 'departments',
      type,
      params,
      listName: 'data',
      initialNum: 150,
      nextNum: 20,
    }),
  );
}

async function searchDepartments(type: 'initial' | 'refresh' | 'next', terms: string, params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_DEPARTMENTS_SEARCH,
      stateUpdate: UPDATE_DEPARTMENTS_STATE,
      url: 'departments/list',
      dataType: 'departments',
      type,
      params: { ...params, search: true, terms },
      stateName: 'search',
      listName: 'search',
      clear: type !== 'next',
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul department
 * @param departmentId L'id de l'department à récuperer
 */
async function fetchDepartment(departmentId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_DEPARTMENTS_ITEM,
      stateUpdate: UPDATE_DEPARTMENTS_STATE,
      stateName: 'info',
      url: 'departments/info',
      dataType: 'departments',
      params: { departmentId },
    }),
  );
}

async function fetchMultiDepartment(departmentIds: string[]) {
  await Promise.all(
    departmentIds.map(async (departmentId) => {
      await Store.dispatch(
        fetchCreator({
          update: UPDATE_DEPARTMENTS_ITEMS,
          stateUpdate: UPDATE_DEPARTMENTS_STATE,
          stateName: 'info',
          url: 'departments/info',
          dataType: 'departments',
          params: { departmentId },
          useArray: true,
        }),
      );
    }),
  );
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
async function clearDepartments(data = true, search = true, items = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_DEPARTMENTS, data, search, items }));
}

export {
  updateDepartments,
  clearDepartments,
  fetchDepartment,
  fetchMultiDepartment,
  searchDepartments,
};
