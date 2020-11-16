import Store from '@redux/store';
import { request } from '@utils/index';
import { AppThunk, UPDATE_LINKING_STATE } from '@ts/redux';

type LinkingProps = {
  url: string;
  parameters: { [key: string]: any };
  state: string;
};

function linkingCreator({ url, parameters, state }: LinkingProps): AppThunk {
  return (dispatch) => {
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

async function linking(url: string, parameters: { [key: string]: any }, state: string) {
  await Store.dispatch(
    linkingCreator({
      url,
      parameters,
      state,
    }),
  );
}

export { linking };
