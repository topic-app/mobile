import Store from '@redux/store';
import { request } from '@utils/index';
import { State } from '@ts/types';
import { UPDATE_LINKING_STATE } from '@ts/redux';

type LinkingProps = {
  url: string;
  parameters: object;
  state: string;
};

function linkingCreator({ url, parameters, state }: LinkingProps) {
  return (dispatch: (action: any) => void, getState: () => State) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_LINKING_STATE,
        data: {
          [state]: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(url, 'get', parameters, false)
        .then((result) => {
          dispatch({
            type: UPDATE_LINKING_STATE,
            data: {
              [state]: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve(result.data);
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_LINKING_STATE,
            data: {
              [state]: {
                loading: false,
                success: false,
                error,
              },
            },
          });
          reject();
        });
    });
  };
}

async function linking(url: string, parameters: object, state: string) {
  await Store.dispatch(
    linkingCreator({
      url,
      parameters,
      state,
    }),
  );
}

export { linking };
