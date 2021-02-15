import Store from '@redux/store';
import { Background, BackgroundNames, Page } from '@ts/groupPages';
import { UPDATE_GROUPS_PAGES, UPDATE_GROUPS_STATE, CLEAR_GROUPS, AppThunk } from '@ts/redux';
import { Group, GroupTemplate } from '@ts/types';
import { request, logger } from '@utils/index';

const nameAscSort = (data: Group[]) => data.sort((a, b) => a.name.localeCompare(b.name));

/**
 * @docs actions
 * Récupère les templates de création de groupe
 * @param next Si il faut récupérer les groupes après le dernier
 */
function fetchGroupPageCreator(group: string, page?: string): AppThunk {
  return async (dispatch, getState) => {
    dispatch({
      type: UPDATE_GROUPS_STATE,
      data: {
        pages: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let result;
    try {
      result = await request(
        'pages/pages/get',
        'get',
        { groupId: group, groupHandle: group, page },
        true,
      );
    } catch (error) {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          pages: { loading: false, success: false, error },
        },
      });
      throw error;
    }
    const data = result.data as {
      groupId: string;
      header: Background<BackgroundNames>;
      footer: Background<BackgroundNames>;
      content: Page;
    };
    const { pages } = getState().groups;
    const res = {
      headers: [
        ...pages.headers.filter((p) => p.group !== data.groupId),
        { content: data.header, group: data.groupId },
      ],
      footers: [
        ...pages.footers.filter((p) => p.group !== data.groupId),
        { content: data.footer, group: data.groupId },
      ],
      pages: [...pages.pages, { ...data.content, group: data.groupId }],
    };

    dispatch({
      type: UPDATE_GROUPS_PAGES,
      data: res,
    });
    dispatch({
      type: UPDATE_GROUPS_STATE,
      data: {
        pages: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    return data.groupId as string;
  };
}

async function fetchGroupPage({ group, page }: { group: string; page?: string }) {
  return Store.dispatch(fetchGroupPageCreator(group, page));
}

async function fetchGroupAllPages() {
  return false;
}

async function clearGroupPages() {
  return false;
}

export { fetchGroupPage, fetchGroupAllPages, clearGroupPages };
