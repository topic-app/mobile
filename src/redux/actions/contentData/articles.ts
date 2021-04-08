import Store from '@redux/store';
import {
  UPDATE_ARTICLES_QUICKS,
  UPDATE_ARTICLES_CREATION_DATA,
  UPDATE_ARTICLES_READ,
  UPDATE_ARTICLES_LISTS,
  UPDATE_ARTICLES_STATE,
  UPDATE_ARTICLES_PREFS,
  CLEAR_ARTICLES,
  ArticlePrefs,
  ArticleCreationData,
  Article,
} from '@ts/types';

import { clearCreator } from '../api/ActionCreator';
import {
  addToListCreator,
  removeFromListCreator,
  addListCreator,
  modifyListCreator,
  deleteListCreator,
  addReadCreator,
  deleteReadCreator,
  clearReadCreator,
  updatePrefsCreator,
  addQuickCreator,
  deleteQuickCreator,
  updateCreationDataCreator,
  clearCreationDataCreator,
  reorderQuickCreator,
  reorderListCreator,
} from './ActionCreator';

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
  Store.dispatch(
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
async function addArticleList(name: string, icon: string = '', description: string = '') {
  Store.dispatch(
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
  icon: string | undefined,
  description: string | undefined,
  items?: Article[],
) {
  Store.dispatch(
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

async function reorderArticleList(from: string, to: string) {
  Store.dispatch(
    reorderListCreator({
      update: UPDATE_ARTICLES_LISTS,
      dataType: 'articleData',
      from,
      to,
    }),
  );
}

/**
 * @docs actions
 * Supprime une liste
 * @param listId L'id de la liste
 */
async function deleteArticleList(listId: string) {
  Store.dispatch(
    deleteListCreator({
      update: UPDATE_ARTICLES_LISTS,
      dataType: 'articleData',
      id: listId,
    }),
  );
}

async function addArticleRead(articleId: string, title: string, marked: boolean = false) {
  Store.dispatch(
    addReadCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
      data: { id: articleId, title, date: new Date(), marked },
    }),
  );
}

async function deleteArticleRead(articleId: string) {
  Store.dispatch(
    deleteReadCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
      id: articleId,
    }),
  );
}

async function clearArticlesRead() {
  Store.dispatch(
    clearReadCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
    }),
  );
}

async function updateArticlePrefs(prefs: Partial<ArticlePrefs>) {
  Store.dispatch(
    updatePrefsCreator({
      updatePrefs: UPDATE_ARTICLES_PREFS,
      prefs,
    }),
  );
}

async function addArticleQuick(type: string, id: string, title: string) {
  Store.dispatch(
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
  Store.dispatch(
    deleteQuickCreator({
      updateQuicks: UPDATE_ARTICLES_QUICKS,
      dataType: 'articleData',
      id,
    }),
  );
}

async function reorderArticleQuick(from: string, to: string) {
  Store.dispatch(
    reorderQuickCreator({
      updateQuicks: UPDATE_ARTICLES_QUICKS,
      dataType: 'articleData',
      from,
      to,
    }),
  );
}

async function updateArticleCreationData(fields: Partial<ArticleCreationData>) {
  Store.dispatch(
    updateCreationDataCreator({
      updateCreationData: UPDATE_ARTICLES_CREATION_DATA,
      dataType: 'articleData',
      fields,
    }),
  );
}

async function clearArticleCreationData() {
  Store.dispatch(
    clearCreationDataCreator({
      dataType: 'articleData',
      updateCreationData: UPDATE_ARTICLES_CREATION_DATA,
    }),
  );
}

export {
  addArticleToList,
  removeArticleFromList,
  addArticleList,
  modifyArticleList,
  reorderArticleList,
  deleteArticleList,
  addArticleRead,
  deleteArticleRead,
  clearArticlesRead,
  updateArticlePrefs,
  addArticleQuick,
  deleteArticleQuick,
  reorderArticleQuick,
  updateArticleCreationData,
  clearArticleCreationData,
};
