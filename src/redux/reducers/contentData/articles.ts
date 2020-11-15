import {
  ArticlesDataState,
  ArticlesActionTypes,
  UPDATE_ARTICLES_PARAMS,
  UPDATE_ARTICLES_LISTS,
  UPDATE_ARTICLES_READ,
  UPDATE_ARTICLES_PREFS,
  UPDATE_ARTICLES_QUICKS,
  UPDATE_ARTICLES_CREATION_DATA,
} from '@ts/redux';

import { Config } from '@constants/index';

const initialState: ArticlesDataState = {
  params: {},
  read: [],
  creationData: {},
  lists: [
    {
      id: '0',
      name: 'Favoris',
      icon: 'star-outline',
      items: [],
    },
    {
      id: '1',
      name: 'A lire plus tard',
      icon: 'history',
      items: [],
    },
  ],
  quicks: [],
  prefs: {
    categories: ['unread', 'all'],
    hidden: [],
  },
  ...Config.seedDb.articles,
};

/**
 * @docs reducers
 * Reducer pour les articles
 * @param state Contient le contenu de la database redux
 * @param action
 * @param action.type Le type d'action à effectuer: mettre à jour les articles avec action.data ou vider la database
 * @param action.data Les données à remplacer dans la database redux
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
    case UPDATE_ARTICLES_CREATION_DATA:
      return {
        ...state,
        creationData: action.data,
      };
    default:
      return state;
  }
}

export default articleDataReducer;
