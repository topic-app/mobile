import { UPDATE_LEGAL, UPDATE_LEGAL_STATE, State } from '@ts/types';
import Store from '@redux/store';
import request from '@utils/request';

type fetchCreatorProps = {
  document: 'conditions' | 'confidentialite' | 'mentions';
};
function fetchDocumentCreator({ document }: fetchCreatorProps) {
  return (dispatch: (action: any) => void, getState: () => State) => {
    return new Promise((resolve, reject) => {
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
      request(`/legal/${document}`, 'get', {})
        .then((result) => {
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
          resolve();
        })
        .catch((err) => {
          dispatch({
            type: UPDATE_LEGAL_STATE,
            data: {
              [document]: {
                loading: false,
                error: err,
                success: false,
              },
            },
          });
          reject();
        });
    });
  };
}

function fetchDocument(document: 'conditions' | 'confidentialite' | 'mentions') {
  Store.dispatch(fetchDocumentCreator({ document }));
}

export { fetchDocument };
