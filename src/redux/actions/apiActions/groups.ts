import Store from '@redux/store';
import { UPDATE_GROUPS_STATE, AppThunk, GroupCreationData } from '@ts/types';
import { request } from '@utils/index';

import { reportCreator, approveCreator } from './ActionCreator';

function groupFollowCreator({ id }: { id: string }): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
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
            type: UPDATE_GROUPS_STATE,
            data: {
              follow: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ type: 'group', id });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
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

function groupUnfollowCreator({ id }: { id: string }): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
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
            type: UPDATE_GROUPS_STATE,
            data: {
              follow: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ type: 'group', id });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
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

type GroupAddMemberCreatorParams = {
  user: string;
  group: string;
  role: string;
  secondaryRoles: string[];
  expires?: Date | number;
};

function groupAddMemberCreator({
  group,
  user,
  role,
  secondaryRoles,
  expires,
}: GroupAddMemberCreatorParams): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          member_add: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'groups/members/add',
        'post',
        {
          group,
          user,
          role,
          secondaryRoles,
          expires,
          permanent: !expires,
        },
        true,
      )
        .then(() => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_add: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ user, group, role, secondaryRoles });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_add: {
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

type GroupModifyMemberCreatorParams = {
  user: string;
  group: string;
  role: string;
  secondaryRoles: string[];
};
function groupModifyMemberCreator({
  group,
  user,
  role,
  secondaryRoles,
}: GroupModifyMemberCreatorParams): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          member_modify: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'groups/members/modify',
        'post',
        {
          group,
          user,
          role,
          secondaryRoles,
        },
        true,
      )
        .then(() => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_modify: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ user, group, role, secondaryRoles });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_modify: {
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

function groupDeleteMemberCreator({ group, user }: { user: string; group: string }): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          member_delete: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'groups/members/delete',
        'post',
        {
          group,
          user,
        },
        true,
      )
        .then(() => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_delete: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ user, group });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_delete: {
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

function groupMemberAcceptCreator({ group }: { group: string }): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          member_accept: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'groups/members/accept',
        'post',
        {
          group,
        },
        true,
      )
        .then(() => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_accept: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ group });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_accept: {
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

function groupMemberRejectCreator({ group }: { group: string }): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          member_reject: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'groups/members/reject',
        'post',
        {
          group,
        },
        true,
      )
        .then(() => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_reject: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ group });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_reject: {
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

function groupMemberLeaveCreator({ group }: { group: string }): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          member_leave: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'groups/members/leave',
        'post',
        {
          group,
        },
        true,
      )
        .then(() => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_leave: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ group });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              member_leave: {
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

type GroupModifyCreatorParams = {
  group: string;
  shortName?: string;
  aliases?: string[];
  summary?: string;
  description?: {
    parser: 'markdown' | 'plaintext';
    data: string;
  };
};

function groupModifyCreator({
  group,
  shortName,
  aliases,
  summary,
  description,
}: GroupModifyCreatorParams): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          modify: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'groups/modify',
        'post',
        {
          groupId: group,
          group: {
            shortName,
            aliases,
            summary,
            description,
          },
        },
        true,
      )
        .then(() => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              modify: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve({ group });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              modify: {
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

function groupAddCreator({
  name,
  shortName,
  type,
  location,
  summary,
  parser,
  description,
  verification,
  legal,
}: GroupCreationData): AppThunk<Promise<{ _id: string }>> {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: UPDATE_GROUPS_STATE,
        data: {
          add: {
            loading: true,
            success: null,
            error: null,
          },
        },
      });
      request(
        'groups/templates/add',
        'post',
        {
          group: {
            name,
            shortName,
            summary,
            description: {
              parser,
              data: description,
            },
            location,
            type,
            legal,
          },
          verification,
        },
        true,
      )
        .then((result) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
            data: {
              add: {
                loading: false,
                success: true,
                error: null,
              },
            },
          });
          resolve(result.data as { _id: string });
        })
        .catch((error) => {
          dispatch({
            type: UPDATE_GROUPS_STATE,
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

async function groupAdd(data: GroupCreationData) {
  return Store.dispatch(groupAddCreator(data));
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

async function groupMemberAdd(
  group: string,
  user: string,
  role: string,
  secondaryRoles: string[],
  expires?: Date | number, // not sure about how this works exactly
) {
  await Store.dispatch(
    groupAddMemberCreator({
      user,
      role,
      group,
      secondaryRoles,
      expires,
    }),
  );
}

async function groupMemberModify(
  group: string,
  user: string,
  role: string,
  secondaryRoles: string[],
) {
  await Store.dispatch(
    groupModifyMemberCreator({
      user,
      role,
      group,
      secondaryRoles,
    }),
  );
}

async function groupMemberDelete(group: string, user: string) {
  await Store.dispatch(
    groupDeleteMemberCreator({
      user,
      group,
    }),
  );
}

async function groupMemberAccept(group: string) {
  await Store.dispatch(groupMemberAcceptCreator({ group }));
}

async function groupMemberReject(group: string) {
  await Store.dispatch(groupMemberRejectCreator({ group }));
}

async function groupMemberLeave(group: string) {
  await Store.dispatch(groupMemberLeaveCreator({ group }));
}

async function groupModify(
  group: string,
  fields: {
    shortName?: string;
    aliases?: string[];
    summary?: string;
    description?: { parser: 'markdown' | 'plaintext'; data: string };
  },
) {
  await Store.dispatch(groupModifyCreator({ group, ...fields }));
}

async function groupReport(groupId: string, reason: string) {
  await Store.dispatch(
    reportCreator({
      contentId: groupId,
      contentIdName: 'groupId',
      url: 'groups/report',
      stateUpdate: UPDATE_GROUPS_STATE,
      reason,
    }),
  );
}

async function groupVerificationApprove(id: string) {
  return Store.dispatch(
    approveCreator({
      url: 'groups/verification/approve',
      stateUpdate: UPDATE_GROUPS_STATE,
      paramName: 'groupId',
      id,
    }),
  );
}

export {
  groupFollow,
  groupUnfollow,
  groupReport,
  groupMemberAdd,
  groupMemberDelete,
  groupMemberModify,
  groupMemberAccept,
  groupMemberReject,
  groupMemberLeave,
  groupVerificationApprove,
  groupModify,
  groupAdd,
};
