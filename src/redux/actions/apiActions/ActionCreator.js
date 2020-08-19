import { request } from '@utils/index';

function reportCreator({ contentId, contentIdName, reason, url, stateUpdate }) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: stateUpdate,
        data: {
          report: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        url,
        'post',
        {
          [contentIdName]: contentId,
          reason,
        },
        true,
      )
        .then((result) => {
          dispatch({
            type: stateUpdate,
            data: {
              report: {
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
            type: stateUpdate,
            data: {
              report: {
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

function approveCreator({ url, stateUpdate, id, paramName }) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: stateUpdate,
        data: {
          verification_approve: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        url,
        'post',
        {
          [paramName]: id,
        },
        true,
      )
        .then((result) => {
          dispatch({
            type: stateUpdate,
            data: {
              verification_approve: {
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
            type: stateUpdate,
            data: {
              verification_approve: {
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

export { reportCreator, approveCreator };
