import Store from '@redux/store';
import { request } from '@utils/index';
import { reportCreator, approveCreator } from './ActionCreator';
import { UPDATE_GROUPS_STATE, ActionType } from '@ts/types';

function groupFollowCreator({ id }: { id: string }) {
  return (dispatch: (action: ActionType) => void) => {
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
  return (dispatch: (action: ActionType) => void) => {
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

function groupAddMemberCreator({
  group,
  user,
  role,
  secondaryRoles,
  expires,
}: {
  user: string;
  group: string;
  role: string;
  secondaryRoles: string[];
  expires: number;
}) {
  return (dispatch: (action: ActionType) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_GROUPS_STATE',
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
            type: 'UPDATE_GROUPS_STATE',
            data: {
              member_add: {
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

function groupDeleteMemberCreator({ group, user }: { user: string; group: string }) {
  return (dispatch: (action: ActionType) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_GROUPS_STATE',
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
            type: 'UPDATE_GROUPS_STATE',
            data: {
              member_delete: {
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

function groupMemberAcceptCreator({ group }: { group: string }) {
  return (dispatch: (action: ActionType) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_GROUPS_STATE',
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
            type: 'UPDATE_GROUPS_STATE',
            data: {
              member_accept: {
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

function groupMemberRejectCreator({ group }: { group: string }) {
  return (dispatch: (action: ActionType) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_GROUPS_STATE',
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
            type: 'UPDATE_GROUPS_STATE',
            data: {
              member_reject: {
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

function groupMemberLeaveCreator({ group }: { group: string }) {
  return (dispatch: (action: ActionType) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_GROUPS_STATE',
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
            type: 'UPDATE_GROUPS_STATE',
            data: {
              member_leave: {
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

function groupModifyCreator({
  group,
  shortName,
  aliases,
  summary,
  description,
}: {
  group: string;
  shortName?: string;
  aliases?: string[];
  summary?: string;
  description?: {
    parser: 'markdown' | 'plaintext';
    data: string;
  };
}) {
  return (dispatch: (action: ActionType) => void) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'UPDATE_GROUPS_STATE',
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
            type: 'UPDATE_GROUPS_STATE',
            data: {
              modify: {
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
  expires: number,
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
  return await Store.dispatch(
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
  groupMemberAccept,
  groupMemberReject,
  groupMemberLeave,
  groupVerificationApprove,
  groupModify,
};
