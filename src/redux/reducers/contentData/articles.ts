import { Platform } from 'react-native';

import {
  ArticlesContentState,
  ArticlesContentActionTypes,
  UPDATE_ARTICLES_PARAMS,
  UPDATE_ARTICLES_LISTS,
  UPDATE_ARTICLES_READ,
  UPDATE_ARTICLES_PREFS,
  UPDATE_ARTICLES_QUICKS,
  UPDATE_ARTICLES_RECOMMENDATIONS,
  UPDATE_ARTICLES_CREATION_DATA,
  FULL_CLEAR,
} from '@ts/redux';

const initialState: ArticlesContentState = {
  params: {},
  read: [],
  creationData: {},
  lists:
    Platform.OS === 'web'
      ? []
      : [
          {
            id: '0',
            name: 'Favoris',
            icon: 'star-outline',
            items: [],
          },
        ],
  quicks: [],
  prefs: {
    categories: ['unread', 'all', 'following'],
    hidden: [],
  },
  recommendations: {
    tags: [],
    users: [],
    groups: [],
  },
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
function articleDataReducer(
  state = initialState,
  action: ArticlesContentActionTypes,
): ArticlesContentState {
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
        prefs: { ...state.prefs, ...action.data },
      };
    case UPDATE_ARTICLES_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          ...action.data,
        },
      };
    case UPDATE_ARTICLES_CREATION_DATA:
      return {
        ...state,
        creationData: action.data,
      };
    case FULL_CLEAR:
      return initialState;
    default:
      return state;
  }
}

export default articleDataReducer;
