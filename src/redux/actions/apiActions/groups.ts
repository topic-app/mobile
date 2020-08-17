import Store from '@redux/store';
import { request } from '@utils/index';

function groupFollowCreator({ id }: { id: string }) {
  return (dispatch: (action: { type: string; data: any }) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_GROUPS_STATE',
        data: {
          follow: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'profile/follow',
        'post',
        {
          type: 'group',
          id,
        },
        true,
      )
        .then(() => {
          dispatch({
            type: 'UPDATE_GROUPS_STATE',
            data: {
              follow: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve();
        })
        .catch((error) => {
          dispatch({
            type: 'UPDATE_GROUPS_STATE',
            data: {
              follow: {
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

function groupUnfollowCreator({ id }: { id: string }) {
  return (dispatch: (action: { type: string; data: any }) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_GROUPS_STATE',
        data: {
          follow: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'profile/unfollow',
        'post',
        {
          id,
          type: 'group',
        },
        true,
      )
        .then(() => {
          dispatch({
            type: 'UPDATE_GROUPS_STATE',
            data: {
              follow: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve();
        })
        .catch((error) => {
          dispatch({
            type: 'UPDATE_GROUPS_STATE',
            data: {
              follow: {
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

async function groupFollow(id: string) {
  await Store.dispatch(
    groupFollowCreator({
      id,
    }),
  );
}

async function groupUnfollow(id: string) {
  await Store.dispatch(
    groupUnfollowCreator({
      id,
    }),
  );
}

export { groupFollow, groupUnfollow };
