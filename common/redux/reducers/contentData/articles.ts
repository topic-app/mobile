import {
  ArticlesDataState,
  ArticlesActionTypes,
  UPDATE_ARTICLES_PARAMS,
  UPDATE_ARTICLES_LISTS,
  UPDATE_ARTICLES_READ,
  UPDATE_ARTICLES_PREFS,
  UPDATE_ARTICLES_QUICKS,
} from '@ts/redux';

import { config } from '@root/app.json';

const initialState: ArticlesDataState = {
  params: {},
  lists: config.articles.lists,
  prefs: config.articles.defaults,
  quicks: config.articles.quicks,
  read: [],
};

/**
 * @docs reducers
 * Reducer pour les articles
 * @param {object} state Contient le contenu de la database redux
 * @param {object} action
 * @param {string} action.type ['UPDATE_ARTICLES', 'CLEAR_ARTICLES'] Le type d'action à effectuer: mettre à jour les articles avec action.data ou vider la database
 * @param {object} action.data Les données à remplacer dans la database redux
 * @returns Nouveau state
 */
function articleDataReducer(state = initialState, action: ArticlesActionTypes): ArticlesDataState {
  switch (action.type) {
    case UPDATE_ARTICLES_PARAMS:
      return {
        ...state,
        params: action.data,
      };
    case UPDATE_ARTICLES_LISTS:
      return {
        ...state,
        lists: action.data,
      };
    case UPDATE_ARTICLES_READ:
      return {
        ...state,
        read: action.data,
      };
    case UPDATE_ARTICLES_QUICKS:
      return {
        ...state,
        quicks: action.data,
      };
    case UPDATE_ARTICLES_PREFS:
      return {
        ...state,
        prefs: action.data,
      };
    default:
      return state;
  }
}

export default articleDataReducer;
