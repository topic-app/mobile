import Store from '@redux/store';
import { AppThunk, UPDATE_LEGAL, UPDATE_LEGAL_STATE } from '@ts/types';
import request from '@utils/request';

type FetchCreatorParams = {
  document: 'conditions' | 'confidentialite' | 'mentions';
};
function fetchDocumentCreator({ document }: FetchCreatorParams): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_LEGAL_STATE,
      data: {
        [document]: {
          loading: true,
          error: null,
          success: null,
        },
      },
    });
    let result;
    try {
      result = await request(`/legal/${document}`, 'get', {});
    } catch (error) {
      dispatch({
        type: UPDATE_LEGAL_STATE,
        data: {
          [document]: {
            loading: false,
            error,
            success: false,
          },
        },
      });
      throw error;
    }
    const content = result.data?.content;
    dispatch({
      type: UPDATE_LEGAL,
      data: { [document]: content },
    });
    dispatch({
      type: UPDATE_LEGAL_STATE,
      data: {
        [document]: {
          loading: false,
          error: null,
          success: true,
        },
      },
    });
    return { document };
  };
}

function fetchDocument(document: 'conditions' | 'confidentialite' | 'mentions') {
  Store.dispatch(fetchDocumentCreator({ document }));
}

export { fetchDocument };
