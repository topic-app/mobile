import { Account, AccountPermission } from '@ts/types';

export const Permissions = {
  ARTICLE_ADD: 'article.add',
  ARTICLE_MODIFY: 'article.modify',
  ARTICLE_DELETE: 'article.delete',
  ARTICLE_VERIFICATION_VIEW: 'article.verification.view',
  ARTICLE_VERIFICATION_APPROVE: 'article.verification.approve',
  ARTICLE_VERIFICATION_APPROVE_EXTRA: 'article.verification.approve.extra',
  ARTICLE_VERIFICATION_DEVERIFY: 'article.verification.deverify',

  COMMENT_ADD: 'comment.add',
  COMMENT_MODIFY: 'comment.modify',
  COMMENT_DELETE: 'comment.delete',
  COMMENT_VERIFICATION_VIEW: 'comment.verification.view',

  GROUP_MODIFY: 'group.modify',
  GROUP_MODIFY_LOCATION: 'group.modify.location',
  GROUP_MEMBERS_ADD: 'group.members.add',
  GROUP_MEMBERS_MODIFY: 'group.members.modify',
  GROUP_MEMBERS_DELETE: 'group.members.delete',
  GROUP_ROLES_ADD: 'group.roles.add',
  GROUP_ROLES_MODIFY: 'group.roles.modify',
  GROUP_ROLES_DELETE: 'group.roles.delete',
  GROUP_VERIFICATION_VIEW: 'group.verification.view',
  GROUP_VERIFICATION_APPROVE: 'group.verification.approve',
  GROUP_VERIFICATION_DEVERIFY: 'group.verification.deverify',

  CONTENT_UPLOAD: 'content.upload',

  EVENT_ADD: 'event.add',
  EVENT_MODIFY: 'event.modify',
  EVENT_DELETE: 'event.delete',
  EVENT_DELETE_IMMEDIATE: 'event.delete.immediate',
  EVENT_VERIFICATION_VIEW: 'event.verification.view',
  EVENT_VERIFICATION_APPROVE: 'event.verification.approve',
  EVENT_VERIFICATION_APPROVE_EXTRA: 'event.verification.approve.extra',
  EVENT_MESSAGES_ADD: 'event.messages.add',
  EVENT_MESSAGES_DELETE: 'event.messages.delete',
  EVENT_VERIFICATION_DEVERIFY: 'event.verification.deverify',

  PLACE_ADD: 'place.add',
  PLACE_MODIFY: 'place.modify',
  PLACE_DELETE: 'place.delete',
  PLACE_VERIFICATION_VIEW: 'place.verification.view',
  PLACE_VERIFICATION_APPROVE: 'place.verification.approve',
  PLACE_VERIFICATION_APPROVE_EXTRA: 'place.verification.approve.extra',
  PLACE_VERIFICATION_DEVERIFY: 'place.verification.deverify',

  TAG_ADD: 'tag.add',
  TAG_DELETE: 'tag.delete',

  USER_VERIFICATION_VIEW: 'user.verification.view',
};

export function checkPermission(
  account: Account,
  permission: {
    permission: string;
    scope?: {
      self?: boolean;
      everywhere?: boolean;
      global?: boolean;
      groups?: string[];
      schools?: string[];
      departments?: string[];
    };
  },
  group?: string,
): boolean {
  if (!account.loggedIn) return false;
  return account.permissions.some((accountPermission) => {
    if (accountPermission.permission !== permission.permission) {
      return false;
    }
    if (group && accountPermission.group !== group) {
      return false;
    }

    if (accountPermission.scope.everywhere) {
      return true;
    }

    const groupsScope = (permission.scope?.groups || []).every(
      (g) =>
        accountPermission.scope.groups?.includes(g) ||
        (accountPermission.group === g && accountPermission.scope.self),
    );
    const schoolsScope = (permission.scope?.schools || []).every((s) =>
      accountPermission.scope.schools?.includes(s),
    );
    const departmentsScope = (permission.scope?.departments || [])?.every((d) =>
      accountPermission.scope.departments?.includes(d),
    );
    const globalScope = !permission.scope?.global || accountPermission.scope.global;

    return groupsScope && schoolsScope && departmentsScope && globalScope;
  });
}

export function getPermissionGroups(account: Account, permission: string) {
  if (!account.loggedIn) return [];

  return account.permissions.reduce((groups: string[], p: AccountPermission) => {
    if (p.permission === permission) {
      return [...groups, ...(p.scope.self ? [p.group] : []), ...(p.scope.groups || [])];
    } else {
      return groups;
    }
  }, []);
}
