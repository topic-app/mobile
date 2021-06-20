import Store from '@redux/store';
import { AppThunk, UPDATE_TAGS_STATE } from '@ts/redux';
import { request } from '@utils';

type TagAddProps = {
  name: string;
  color: string;
  parser: 'plaintext' | 'markdown';
  data: string;
};

function tagAddCreator({
  name,
  color,
  parser,
  data,
}: TagAddProps): AppThunk<Promise<{ _id: string }>> {
  return async (dispatch) => {
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
    let result;
    try {
      result = await request(
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
      );
    } catch (error) {
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
      throw error;
    }
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
    return result.data as { _id: string };
  };
}

async function tagAdd(data: TagAddProps) {
  return Store.dispatch(tagAddCreator(data));
}

export { tagAdd };
