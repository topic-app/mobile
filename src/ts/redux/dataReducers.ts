import themes from '@styles/Theme';

import {
  AccountPermission,
  AccountInfo,
  AccountUser,
  AccountCreationData,
  WaitingGroup,
  GroupWithMembership,
  SchoolPreload,
  DepartmentPreload,
} from '../api';
import { LocationRequestState, AccountRequestState } from '../requestState';

// Account
export const UPDATE_ACCOUNT_GROUPS = 'UPDATE_ACCOUNT_GROUPS';
export const UPDATE_ACCOUNT_PERMISSIONS = 'UPDATE_ACCOUNT_PERMISSIONS';
export const UPDATE_ACCOUNT_STATE = 'UPDATE_ACCOUNT_STATE';
export const UPDATE_ACCOUNT_WAITING_GROUPS = 'UPDATE_ACCOUNT_WAITING_GROUPS';
export const LOGOUT = 'LOGOUT';
export const LOGIN = 'LOGIN';
export const UPDATE_ACCOUNT_USER = 'UPDATE_ACCOUNT_USER';
export const UPDATE_ACCOUNT_CREATION_DATA = 'UPDATE_ACCOUNT_CREATION_DATA';
export const CLEAR_ACCOUNT_CREATION_DATA = 'CLEAR_ACCOUNT_CREATION_DATA';

export type Account =
  | {
      loggedIn: true;
      accountInfo: AccountInfo;
      creationData: AccountCreationData;
      state: AccountRequestState;
      groups: GroupWithMembership[];
      permissions: AccountPermission[];
      waitingGroups: WaitingGroup[];
    }
  | {
      loggedIn: false;
      accountInfo: null;
      creationData: AccountCreationData;
      state: AccountRequestState;
      groups: never[];
      permissions: never[];
      waitingGroups: never[];
    };

export type AccountState = Account;

type UpdateAccountGroupsAction = {
  type: typeof UPDATE_ACCOUNT_GROUPS;
  data: GroupWithMembership[];
};

type UpdateAccountPermissionsAction = {
  type: typeof UPDATE_ACCOUNT_PERMISSIONS;
  data: AccountPermission[];
};

type UpdateAccountStateAction = {
  type: typeof UPDATE_ACCOUNT_STATE;
  data: Partial<AccountRequestState>;
};

type UpdateAccountWaitingGroupsAction = {
  type: typeof UPDATE_ACCOUNT_WAITING_GROUPS;
  data: WaitingGroup[];
};

type LogoutAction = {
  type: typeof LOGOUT;
  data: {};
};

type LoginAction = {
  type: typeof LOGIN;
  data: { accountInfo: AccountInfo };
};

type UpdateAccountUserAction = {
  type: typeof UPDATE_ACCOUNT_USER;
  data: AccountUser;
};

type UpdateAccountCreationDataAction = {
  type: typeof UPDATE_ACCOUNT_CREATION_DATA;
  data: Partial<AccountCreationData>;
};

type ClearAccountCreationDataAction = {
  type: typeof CLEAR_ACCOUNT_CREATION_DATA;
  data: {};
};

export type AccountActionTypes =
  | UpdateAccountGroupsAction
  | UpdateAccountPermissionsAction
  | UpdateAccountStateAction
  | UpdateAccountWaitingGroupsAction
  | LogoutAction
  | LoginAction
  | UpdateAccountUserAction
  | UpdateAccountCreationDataAction
  | ClearAccountCreationDataAction;

// Location
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const UPDATE_LOCATION_STATE = 'UPDATE_LOCATION_STATE';
export const CLEAR_LOCATION = 'CLEAR_LOCATION';

export type LocationList = {
  selected: boolean;
  global: boolean;
  schools: string[];
  schoolData: SchoolPreload[];
  departments: string[];
  departmentData: DepartmentPreload[];
  state: LocationRequestState;
};

export type LocationState = LocationList;

type UpdateLocationAction = {
  type: typeof UPDATE_LOCATION;
  data: Partial<LocationState>;
};

type UpdateLocationStateAction = {
  type: typeof UPDATE_LOCATION_STATE;
  data: Partial<LocationRequestState>;
};

type ClearLocationAction = {
  type: typeof CLEAR_LOCATION;
  data: {};
};

export type LocationActionTypes =
  | UpdateLocationAction
  | UpdateLocationStateAction
  | ClearLocationAction;

// Prefs
export const SET_PREFS = 'SET_PREFS';
export const CLEAR_PREF = 'CLEAR_PREF';
export const CLEAR_ALL_PREFS = 'CLEAR_ALL_PREFS';

export type Preferences = {
  // This is equivalent to JS's Object.keys() for types (hover over theme for more info)
  theme: keyof typeof themes;
  useSystemTheme: boolean;
  history: boolean;
  recommendations: boolean;
  syncHistory: boolean;
  syncLists: boolean;
  fontSize: number;
  stripFormatting: boolean;
  fontFamily: string;
  themeEasterEggDiscovered: boolean;
};

export type PreferencesState = Preferences;

type SetPrefAction = {
  type: typeof SET_PREFS;
  data: Partial<Preferences>;
};

type ClearPrefAction = {
  type: typeof CLEAR_PREF;
  data: keyof Preferences;
};

type ClearAllPrefsAction = {
  type: typeof CLEAR_ALL_PREFS;
  data: {};
};

export type PrefActionTypes = SetPrefAction | ClearPrefAction | ClearAllPrefsAction;
