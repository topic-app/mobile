import Store from '@redux/store';
import { Item } from '@ts/types';
import {
  UPDATE_SCHOOLS_DATA,
  UPDATE_SCHOOLS_ITEM,
  UPDATE_SCHOOLS_ITEMS,
  UPDATE_SCHOOLS_SEARCH,
  UPDATE_SCHOOLS_STATE,
  UPDATE_SCHOOLS_NEAR,
  CLEAR_SCHOOLS,
} from '@ts/redux';

import { clearCreator, fetchCreator, updateCreator } from './ActionCreator';

const nameAscSort = (data: Item[]) => data; // .sort((a, b) => a?.name?.localCompare(b?.name));

/**
 * @docs actions
 * Récupère les infos basiques schools depuis le serveur
 * @param next Si il faut récupérer les schools après le dernier
 */
async function updateSchools(type: 'initial' | 'refresh' | 'next', params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_SCHOOLS_DATA,
      stateUpdate: UPDATE_SCHOOLS_STATE,
      url: 'schools/list',
      sort: nameAscSort,
      dataType: 'schools',
      type,
      params,
      listName: 'data',
      initialNum: 50,
      nextNum: 30,
    }),
  );
}

async function updateNearSchools(
  type: 'initial' | 'refresh',
  latitude: number,
  longitude: number,
  number = 30,
  maxDistance = 100000,
) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_SCHOOLS_NEAR,
      stateUpdate: UPDATE_SCHOOLS_STATE,
      stateName: 'near',
      url: 'schools/near',
      dataType: 'schools',
      type,
      params: { latitude, longitude, maxDistance, number },
      listName: 'near',
      clear: true,
    }),
  );
}

async function searchSchools(type: 'initial' | 'refresh' | 'next', terms: string, params = {}) {
  await Store.dispatch(
    updateCreator({
      update: UPDATE_SCHOOLS_SEARCH,
      stateUpdate: UPDATE_SCHOOLS_STATE,
      url: 'schools/list',
      dataType: 'schools',
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
 * Récupère toutes les infos publiques d'un seul school
 * @param schoolId L'id de l'school à récuperer
 */
async function fetchSchool(schoolId: string) {
  await Store.dispatch(
    fetchCreator({
      update: UPDATE_SCHOOLS_ITEM,
      stateUpdate: UPDATE_SCHOOLS_STATE,
      url: 'schools/info',
      dataType: 'schools',
      params: { schoolId },
    }),
  );
}

/**
 * @docs actions
 * Récupère toutes les infos publiques d'un seul school
 * @param schoolId L'id de l'school à récuperer
 */
async function fetchMultiSchool(schoolIds: string[]) {
  schoolIds.forEach(async (schoolId) => {
    await Store.dispatch(
      fetchCreator({
        update: UPDATE_SCHOOLS_ITEMS,
        stateUpdate: UPDATE_SCHOOLS_STATE,
        url: 'schools/info',
        dataType: 'schools',
        params: { schoolId },
        useArray: true,
      }),
    );
  });
}

/**
 * @docs actions
 * Vide la database redux complètement
 */
async function clearSchools(data = true, search = true) {
  await Store.dispatch(clearCreator({ clear: CLEAR_SCHOOLS, data, search }));
}

export {
  updateSchools,
  clearSchools,
  fetchSchool,
  fetchMultiSchool,
  searchSchools,
  updateNearSchools,
};
