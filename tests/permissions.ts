import { Account } from '@ts/types';
import { checkPermission, Permissions } from '@utils';

test('it should give permission with groups', () => {
  const check = checkPermission(
    ({
      loggedIn: true,
      permissions: [
        {
          group: 'hi',
          permission: Permissions.ARTICLE_ADD,
          scope: {
            groups: ['hello'],
            schools: [],
            departments: [],
            global: false,
            self: false,
            everywhere: false,
          },
        },
      ],
    } as unknown) as Account,
    { permission: Permissions.ARTICLE_ADD, scope: { groups: ['hello'] } },
  );
  expect(check).toBe(true);
});

test('it should give permission with self', () => {
  const check = checkPermission(
    ({
      loggedIn: true,
      permissions: [
        {
          group: 'hello',
          permission: Permissions.ARTICLE_ADD,
          scope: {
            groups: [],
            schools: [],
            departments: [],
            global: false,
            self: true,
            everywhere: false,
          },
        },
      ],
    } as unknown) as Account,
    { permission: Permissions.ARTICLE_ADD, scope: { groups: ['hello'] } },
  );
  expect(check).toBe(true);
});

test('it should refuse permission with groups', () => {
  const check = checkPermission(
    ({
      loggedIn: true,
      permissions: [
        {
          group: 'hi',
          permission: Permissions.ARTICLE_ADD,
          scope: {
            groups: ['notme'],
            schools: [],
            departments: [],
            global: false,
            self: true,
            everywhere: false,
          },
        },
      ],
    } as unknown) as Account,
    { permission: Permissions.ARTICLE_ADD, scope: { groups: ['hello'] } },
  );
  expect(check).toBe(false);
});

test('it should give permission with everywhere', () => {
  const check = checkPermission(
    ({
      loggedIn: true,
      permissions: [
        {
          group: 'hi',
          permission: Permissions.ARTICLE_ADD,
          scope: {
            groups: ['notme'],
            schools: [],
            departments: [],
            global: false,
            self: true,
            everywhere: true,
          },
        },
      ],
    } as unknown) as Account,
    { permission: Permissions.ARTICLE_ADD, scope: { groups: ['hello'] } },
  );
  expect(check).toBe(true);
});

test('it should give permission with schools and departments', () => {
  const check = checkPermission(
    ({
      loggedIn: true,
      permissions: [
        {
          group: 'hi',
          permission: Permissions.ARTICLE_ADD,
          scope: {
            groups: ['hello'],
            schools: ['school1', 'school2', 'school3'],
            departments: ['department1'],
            global: false,
            self: false,
            everywhere: false,
          },
        },
      ],
    } as unknown) as Account,
    {
      permission: Permissions.ARTICLE_ADD,
      scope: { schools: ['school1', 'school2'], departments: ['department1'] },
    },
  );
  expect(check).toBe(true);
});
