import shortid from 'shortid';

import Store from '@redux/store';
import {
  UPDATE_ARTICLES_QUICKS,
  UPDATE_ARTICLES_CREATION_DATA,
  UPDATE_ARTICLES_READ,
  UPDATE_ARTICLES_STATE,
  UPDATE_ARTICLES_PREFS,
  CLEAR_ARTICLES,
  ArticlePrefs,
  ArticleCreationData,
  Article,
} from '@ts/types';

import { clearCreator } from '../api/ActionCreator';
import {
  addReadCreator,
  deleteReadCreator,
  clearReadCreator,
  updatePrefsCreator,
  addQuickCreator,
  deleteQuickCreator,
  updateCreationDataCreator,
  clearCreationDataCreator,
  reorderQuickCreator,
  deleteReadAllCreator,
} from './ActionCreator';

async function addArticleRead(
  articleId: string,
  title?: string,
  marked: boolean = false,
  date?: Date,
) {
  Store.dispatch(
    addReadCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
      data: { key: shortid(), id: articleId, title, date: date || new Date(), marked },
    }),
  );
}

async function deleteArticleRead(key: string) {
  Store.dispatch(
    deleteReadCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
      key,
    }),
  );
}

async function deleteArticleReadAll(id: string) {
  Store.dispatch(
    deleteReadAllCreator({
      update: UPDATE_ARTICLES_READ,
      dataType: 'articleData',
      id,
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
  addArticleRead,
  deleteArticleRead,
  deleteArticleReadAll,
  clearArticlesRead,
  updateArticlePrefs,
  addArticleQuick,
  deleteArticleQuick,
  reorderArticleQuick,
  updateArticleCreationData,
  clearArticleCreationData,
};
