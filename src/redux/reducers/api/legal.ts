import { LegalActionTypes, LegalState, UPDATE_LEGAL_STATE, UPDATE_LEGAL } from '@ts/redux';

const initialState: LegalState = {
  conditions: 'Chargement...',
  confidentialite: 'Chargement...',
  mentions: 'Chargement...',
  state: {
    conditions: {
      loading: false,
      error: null,
      success: null,
    },
    confidentialite: {
      loading: false,
      error: null,
      success: null,
    },
    mentions: {
      loading: false,
      error: null,
      success: null,
    },
  },
};

function legalReducer(state = initialState, action: LegalActionTypes): LegalState {
  switch (action.type) {
    case UPDATE_LEGAL_STATE:
      return {
        ...state,
        state: { ...state.state, ...action.data },
      };
    case UPDATE_LEGAL:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
}

export default legalReducer;
