import Store from '@redux/store';
import { AppThunk, UPDATE_LINKING_STATE } from '@ts/redux';
import { request } from '@utils/index';

type LinkingProps = {
  url: string;
  parameters: { [key: string]: any };
  state: string;
  auth?: boolean;
};

function linkingCreator({ url, parameters, state, auth = false }: LinkingProps): AppThunk {
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
      request(url, 'get', parameters, false, auth ? 'auth' : 'base')
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

async function linking(
  url: string,
  parameters: { [key: string]: any },
  state: string,
  auth: boolean,
) {
  await Store.dispatch(
    linkingCreator({
      url,
      parameters,
      state,
      auth,
    }),
  );
}

export { linking };
