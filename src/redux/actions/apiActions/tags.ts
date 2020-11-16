import Store from '@redux/store';
import { request } from '@utils/index';
import { AppThunk, UPDATE_TAGS_STATE } from '@ts/redux';

type TagAddProps = {
  name: string;
  color: string;
  parser: 'plaintext' | 'markdown';
  data: string;
};

function tagAddCreator({ name, color, parser, data }: TagAddProps): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_TAGS_STATE,
        data: {
          add: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'tags/add',
        'post',
        {
          tag: {
            name,
            color,
            description: {
              parser,
              data,
            },
          },
        },
        true,
      )
        .then((result) => {
          dispatch({
            type: UPDATE_TAGS_STATE,
            data: {
              add: {
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
            type: UPDATE_TAGS_STATE,
            data: {
              add: {
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

function tagAdd(data: TagAddProps) {
  return Store.dispatch(tagAddCreator(data));
}

export { tagAdd };
