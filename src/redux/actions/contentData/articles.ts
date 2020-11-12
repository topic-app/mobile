import Store from '@redux/store';

import {
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
} from './ActionCreator';

import {
  UPDATE_ARTICLES_QUICKS,
  UPDATE_ARTICLES_CREATION_DATA,
  UPDATE_ARTICLES_READ,
  UPDATE_ARTICLES_LISTS,
  UPDATE_ARTICLES_STATE,
  UPDATE_ARTICLES_PREFS,
  UPDATE_ARTICLES_PARAMS,
  CLEAR_ARTICLES,
  Item,
  ArticlePrefs,
  ArticleCreationData,
  Article,
} from '@ts/types';

import { clearCreator } from '../api/ActionCreator';

/**
 * @docs actions
 * Ajoute un article à une list
 * @param articleId L'id de l'article à récuperer
 */
async function addArticleToList(articleId: string, listId: string) {
  await Store.dispatch(
    addToListCreator({
      update: UPDATE_ARTICLES_LISTS,
      stateUpdate: UPDATE_ARTICLES_STATE,
      url: 'articles/info',
      dataType: 'articleData',
      resType: 'articles',
      params: { articleId },
      id: listId,
    }),
  );
}

/**
 * @docs actions
 * Enleve un article d'une list
 * @param articleId L'id de l'article à récuperer
 * @param listId La liste de laquelle il faut enlever l'article
 */
async function removeArticleFromList(articleId: string, listId: string) {
  await Store.dispatch(
    removeFromListCreator({
      update: UPDATE_ARTICLES_LISTS,
      dataType: 'articleData',
      itemId: articleId,
      id: listId,
    }),
  );
}

/**
 * @docs actions
 * Ajoute une liste
 * @param name Le nom de la liste
 * @param icon
 * @param description
 */
async function addArticleList(name: string, icon: string, description: string) {
  await Store.dispatch(
    addListCreator({
      update: UPDATE_ARTICLES_LISTS,
      dataType: 'articleData',
      name,
      icon,
      description,
    }),
  );
}

/**
 * @docs actions
 * Modifie une liste
 * @param listId L'id de la liste
 * @param name Le nom de la liste
 * @param icon
 * @param description
 */
async function modifyArticleList(
  listId: string,
  name: string,
  icon: string,
  description: string,
  items: Article[],
) {
  await Store.dispatch(
    modifyListCreator({
      update: UPDATE_ARTICLES_LISTS,
      dataType: 'articleData',
      id: listId,
      name,
      icon,
      description,
      items,
    }),
  );
}

/**
 * @docs actions
 * Supprime une liste
 * @param listId L'id de la liste
 */
async function deleteArticleList(listId: string) {
  await Store.dispatch(
    deleteListCreator({
      update: UPDATE_ARTICLES_LISTS,
      dataType: 'articleData',
      id: listId,
    }),
  );
}

async function addArticleRead(articleId: string, title: string, marked: boolean = false) {
  await Store.dispatch(
    addReadCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
      data: { id: articleId, title, date: new Date(), marked },
    }),
  );
}

async function deleteArticleRead(articleId: string) {
  await Store.dispatch(
    deleteReadCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
      id: articleId,
    }),
  );
}

async function clearArticlesRead() {
  await Store.dispatch(
    clearReadCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
    }),
  );
}

/**
 * @docs actions
 * Change les parametres de requete pour un article
 * @param articleId L'id de l'article à récuperer
 */
async function updateArticleParams(params: object) {
  await Store.dispatch(
    updateParamsCreator({
      updateParams: UPDATE_ARTICLES_PARAMS,
      params,
    }),
  );
  await Store.dispatch(
    clearCreator({
      clear: CLEAR_ARTICLES,
    }),
  );
}

async function updateArticlePrefs(prefs: Partial<ArticlePrefs>) {
  await Store.dispatch(
    updatePrefsCreator({
      updatePrefs: UPDATE_ARTICLES_PREFS,
      prefs,
    }),
  );
}

async function addArticleQuick(type: string, id: string, title: string) {
  await Store.dispatch(
    addQuickCreator({
      updateQuicks: UPDATE_ARTICLES_QUICKS,
      dataType: 'articleData',
      type,
      id,
      title,
    }),
  );
}

async function deleteArticleQuick(id: string) {
  await Store.dispatch(
    deleteQuickCreator({
      updateQuicks: UPDATE_ARTICLES_QUICKS,
      dataType: 'articleData',
      id,
    }),
  );
}

async function updateArticleCreationData(fields: Partial<ArticleCreationData>) {
  await Store.dispatch(
    updateCreationDataCreator({
      updateCreationData: UPDATE_ARTICLES_CREATION_DATA,
      dataType: 'articleData',
      fields,
    }),
  );
}

async function clearArticleCreationData() {
  await Store.dispatch(
    clearCreationDataCreator({
      updateCreationData: UPDATE_ARTICLES_CREATION_DATA,
    }),
  );
}

export {
  addArticleToList,
  removeArticleFromList,
  addArticleList,
  modifyArticleList,
  deleteArticleList,
  addArticleRead,
  deleteArticleRead,
  clearArticlesRead,
  updateArticleParams,
  updateArticlePrefs,
  addArticleQuick,
  deleteArticleQuick,
  updateArticleCreationData,
  clearArticleCreationData,
};
