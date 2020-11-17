import themes from '@styles/Theme';

import {
  Article,
  ArticlePreload,
  Comment,
  Department,
  DepartmentPreload,
  Event,
  EventPreload,
  Group,
  GroupPreload,
  Petition,
  PetitionPreload,
  Place,
  PlacePreload,
  School,
  SchoolPreload,
  Tag,
  TagPreload,
  User,
  UserPreload,
  GroupTemplate,
  AccountPermission,
  AccountInfo,
  AccountUser,
  AccountCreationData,
  WaitingGroup,
  GroupWithMembership,
  Account,
  EventVerificationPreload,
  ArticleVerificationPreload,
} from './api';
import {
  ArticleRequestState,
  CommentRequestState,
  DepartmentRequestState,
  EventRequestState,
  GroupRequestState,
  PetitionRequestState,
  PlaceRequestState,
  SchoolRequestState,
  TagRequestState,
  UserRequestState,
  LegalRequestState,
  LocationRequestState,
  LinkingRequestState,
  AccountRequestState,
  UploadRequestState,
} from './requestState';

// Articles
export const UPDATE_ARTICLES_STATE = 'UPDATE_ARTICLES_STATE';
export const UPDATE_ARTICLES_DATA = 'UPDATE_ARTICLES_DATA';
export const UPDATE_ARTICLES_ITEM = 'UPDATE_ARTICLES_ITEM';
export const UPDATE_ARTICLES_FOLLOWING = 'UPDATE_ARTICLES_FOLLOWING';
export const UPDATE_ARTICLES_VERIFICATION = 'UPDATE_ARTICLES_VERIFICATION';
export const UPDATE_ARTICLES_SEARCH = 'UPDATE_ARTICLES_SEARCH';
export const UPDATE_ARTICLES_PARAMS = 'UPDATE_ARTICLES_PARAMS';
export const UPDATE_ARTICLES_LISTS = 'UPDATE_ARTICLES_LISTS';
export const UPDATE_ARTICLES_READ = 'UPDATE_ARTICLES_READ';
export const UPDATE_ARTICLES_PREFS = 'UPDATE_ARTICLES_PREFS';
export const UPDATE_ARTICLES_QUICKS = 'UPDATE_ARTICLES_QUICKS';
export const UPDATE_ARTICLES_CREATION_DATA = 'UPDATE_ARTICLES_CREATION_DATA';
export const CLEAR_ARTICLES = 'CLEAR_ARTICLES';

export type ArticleListItem = {
  id: string;
  name: string;
  description?: string;
  icon: string;
  items: Article[]; // a besoin d'un refactor
};

export type ArticleParams = {
  schools?: string[];
  departments?: string[];
  global?: boolean;
};

export type ArticleQuickItem = {
  type: 'tag' | 'user' | 'group' | 'school' | 'departement' | 'region' | 'global';
  id: string;
  title: string;
};

export type ArticlesState = {
  data: ArticlePreload[];
  following: ArticlePreload[];
  item: Article | null;
  search: ArticlePreload[];
  verification: ArticleVerificationPreload[];
  state: ArticleRequestState;
  creationData: ArticleCreationData;
};

export type ArticlePrefs = {
  categories?: string[];
  hidden?: string[];
};

export type ArticleReadItem = {
  id: string;
  title?: string;
  date?: Date;
  marked: boolean;
};

export type ArticleCreationData = {
  group?: string;
  location?: {
    schools?: string[];
    departments?: string[];
    global?: boolean;
  };
  date?: Date;
  title?: string;
  summary?: string;
  tags?: string[];
  image?: {
    image: string | null;
    thumbnails: {
      small?: boolean;
      medium?: boolean;
      large?: boolean;
    };
  };
  parser?: 'plaintext' | 'markdown';
  data?: string;
};

export type ArticlesDataState = {
  params: ArticleParams;
  lists: ArticleListItem[];
  prefs: ArticlePrefs;
  read: ArticleReadItem[];
  quicks: ArticleQuickItem[];
  creationData: ArticleCreationData;
};

// Types pour les actions
type UpdateArticlesStateAction = {
  type: typeof UPDATE_ARTICLES_STATE;
  data: Partial<ArticleRequestState>;
};

type UpdateArticlesDataAction = {
  type: typeof UPDATE_ARTICLES_DATA;
  data: ArticlePreload[];
};

type UpdateArticlesFollowingAction = {
  type: typeof UPDATE_ARTICLES_FOLLOWING;
  data: ArticlePreload[];
};

type UpdateArticlesItemAction = {
  type: typeof UPDATE_ARTICLES_ITEM;
  data: Article;
};

type UpdateArticlesSearchAction = {
  type: typeof UPDATE_ARTICLES_SEARCH;
  data: ArticlePreload[];
};

type UpdateArticlesParamsAction = {
  type: typeof UPDATE_ARTICLES_PARAMS;
  data: ArticleParams;
};

type UpdateArticlesListsAction = {
  type: typeof UPDATE_ARTICLES_LISTS;
  data: ArticleListItem[];
};

type UpdateArticlesVerificationAction = {
  type: typeof UPDATE_ARTICLES_VERIFICATION;
  data: ArticleVerificationPreload[];
};

type UpdateArticlesReadAction = {
  type: typeof UPDATE_ARTICLES_READ;
  data: ArticleReadItem[];
};

type UpdateArticlesPrefsAction = {
  type: typeof UPDATE_ARTICLES_PREFS;
  data: { hidden?: string[]; default?: string };
};

type UpdateArticlesQuicksAction = {
  type: typeof UPDATE_ARTICLES_QUICKS;
  data: ArticleQuickItem[];
};

type UpdateArticlesCreationDataAction = {
  type: typeof UPDATE_ARTICLES_CREATION_DATA;
  data: Partial<ArticleCreationData>;
};

type ClearArticlesAction = {
  type: typeof CLEAR_ARTICLES;
  data: { data?: boolean; search?: boolean; verification?: boolean; following?: boolean };
};

export type ArticlesActionTypes =
  | UpdateArticlesStateAction
  | UpdateArticlesDataAction
  | UpdateArticlesItemAction
  | UpdateArticlesFollowingAction
  | UpdateArticlesSearchAction
  | UpdateArticlesVerificationAction
  | UpdateArticlesParamsAction
  | UpdateArticlesListsAction
  | UpdateArticlesReadAction
  | UpdateArticlesPrefsAction
  | UpdateArticlesQuicksAction
  | UpdateArticlesCreationDataAction
  | ClearArticlesAction;

// Comments
export const UPDATE_COMMENTS_STATE = 'UPDATE_COMMENTS_STATE';
export const UPDATE_COMMENTS_DATA = 'UPDATE_COMMENTS_DATA';
export const UPDATE_COMMENTS_SEARCH = 'UPDATE_COMMENTS_SEARCH';
export const CLEAR_COMMENTS = 'CLEAR_COMMENTS';

export type CommentsState = {
  data: Comment[];
  search: Comment[];
  state: CommentRequestState;
};

type UpdateCommentsStateAction = {
  type: typeof UPDATE_COMMENTS_STATE;
  data: Partial<CommentRequestState>;
};

type UpdateCommentsDataAction = {
  type: typeof UPDATE_COMMENTS_DATA;
  data: Comment[];
};

type UpdateCommentsSearchAction = {
  type: typeof UPDATE_COMMENTS_SEARCH;
  data: Comment[];
};

type ClearCommentsAction = {
  type: typeof CLEAR_COMMENTS;
  data: { data?: boolean; search?: boolean };
};

export type CommentsActionTypes =
  | UpdateCommentsStateAction
  | UpdateCommentsDataAction
  | UpdateCommentsSearchAction
  | ClearCommentsAction;

// Departments
export const UPDATE_DEPARTMENTS_STATE = 'UPDATE_DEPARTMENTS_STATE';
export const UPDATE_DEPARTMENTS_DATA = 'UPDATE_DEPARTMENTS_DATA';
export const UPDATE_DEPARTMENTS_ITEM = 'UPDATE_DEPARTMENTS_ITEM';
export const UPDATE_DEPARTMENTS_ITEMS = 'UPDATE_DEPARTMENTS_ITEMS';
export const UPDATE_DEPARTMENTS_SEARCH = 'UPDATE_DEPARTMENTS_SEARCH';
export const CLEAR_DEPARTMENTS = 'CLEAR_DEPARTMENTS';

export type DepartmentsState = {
  data: (Department | DepartmentPreload)[];
  item: Department | null;
  items: Department[];
  search: DepartmentPreload[];
  state: DepartmentRequestState;
};

type UpdateDepartmentsStateAction = {
  type: typeof UPDATE_DEPARTMENTS_STATE;
  data: Partial<DepartmentRequestState>;
};

type UpdateDepartmentsDataAction = {
  type: typeof UPDATE_DEPARTMENTS_DATA;
  data: (Department | DepartmentPreload)[];
};

type UpdateDepartmentsItemAction = {
  type: typeof UPDATE_DEPARTMENTS_ITEM;
  data: Department;
};

type UpdateDepartmentsItemsAction = {
  type: typeof UPDATE_DEPARTMENTS_ITEMS;
  data: Department[];
};

type UpdateDepartmentsSearchAction = {
  type: typeof UPDATE_DEPARTMENTS_SEARCH;
  data: DepartmentPreload[];
};

type ClearDepartmentsAction = {
  type: typeof CLEAR_DEPARTMENTS;
  data: { data?: boolean; search?: boolean; items?: boolean };
};

export type DepartmentsActionTypes =
  | UpdateDepartmentsStateAction
  | UpdateDepartmentsDataAction
  | UpdateDepartmentsItemAction
  | UpdateDepartmentsItemsAction
  | UpdateDepartmentsSearchAction
  | ClearDepartmentsAction;

// Events

// Types pour les actions

export const UPDATE_EVENTS_STATE = 'UPDATE_EVENTS_STATE';
export const UPDATE_EVENTS_UPCOMING_DATA = 'UPDATE_EVENTS_UPCOMING_DATA';
export const UPDATE_EVENTS_PASSED_DATA = 'UPDATE_EVENTS_PASSED_DATA';
export const UPDATE_EVENTS_ITEM = 'UPDATE_EVENTS_ITEM';
export const UPDATE_EVENTS_VERIFICATION = 'UPDATE_EVENTS_VERIFICATION';
export const UPDATE_EVENTS_SEARCH = 'UPDATE_EVENTS_SEARCH';
export const UPDATE_EVENTS_PARAMS = 'UPDATE_EVENTS_PARAMS';
export const UPDATE_EVENTS_FOLLOWING = 'UPDATE_EVENTS_FOLLOWING';
export const UPDATE_EVENTS_LISTS = 'UPDATE_EVENTS_LISTS';
export const UPDATE_EVENTS_READ = 'UPDATE_EVENTS_READ';
export const UPDATE_EVENTS_PREFS = 'UPDATE_EVENTS_PREFS';
export const UPDATE_EVENTS_QUICKS = 'UPDATE_EVENTS_QUICKS';
export const UPDATE_EVENTS_CREATION_DATA = 'UPDATE_EVENTS_CREATION_DATA';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';

export type EventsState = {
  dataUpcoming: EventPreload[];
  dataPassed: EventPreload[];
  following: EventPreload[];
  item: Event | null;
  search: EventPreload[];
  verification: EventVerificationPreload[];
  state: EventRequestState;
  creationData: EventCreationData;
};

export type EventListItem = {
  id: string;
  name: string;
  description?: string;
  icon: string;
  items: Event[]; // a besoin d'un refactor
};

export type EventParams = {
  schools?: string[];
  departments?: string[];
  global?: boolean;
};

export type EventQuickItem = {
  type: 'tag' | 'user' | 'group';
  id: string;
  title: string;
};

export type EventPrefs = {
  categories?: string[];
  hidden?: string[];
};

export type EventReadItem = {
  id: string;
  title?: string;
  date?: Date;
  marked: boolean;
};

export type EventCreationData = {
  title?: string;
  summary?: string;
  description?: string;
  phone?: string;
  email?: string;
  contact?: {
    key: string;
    value: string;
    link: string;
  }[];
  organizers?: string[];
  start?: Date;
  end?: Date;
  date?: Date;
  location?: {
    schools?: string[];
    departments?: string[];
    global?: boolean;
  };
  group?: string;
  place?: string[];
  parser?: 'markdown' | 'plaintext';
  preferences?: {
    comments?: boolean;
  };
  tags?: string[];
  program?: string[];
};

export type EventsDataState = {
  params: EventParams;
  lists: EventListItem[];
  prefs: EventPrefs;
  read: EventReadItem[];
  quicks: EventQuickItem[];
  creationData: EventCreationData;
};

type UpdateEventsStateAction = {
  type: typeof UPDATE_EVENTS_STATE;
  data: Partial<EventRequestState>;
};

type UpdateEventsUpcomingDataAction = {
  type: typeof UPDATE_EVENTS_UPCOMING_DATA;
  data: EventPreload[];
};

type UpdateEventsPassedDataAction = {
  type: typeof UPDATE_EVENTS_PASSED_DATA;
  data: EventPreload[];
};

type UpdateEventsFollowingAction = {
  type: typeof UPDATE_EVENTS_FOLLOWING;
  data: EventPreload[];
};

type UpdateEventsItemAction = {
  type: typeof UPDATE_EVENTS_ITEM;
  data: Event;
};

type UpdateEventsSearchAction = {
  type: typeof UPDATE_EVENTS_SEARCH;
  data: EventPreload[];
};

type UpdateEventsParamsAction = {
  type: typeof UPDATE_EVENTS_PARAMS;
  data: EventParams;
};

type UpdateEventsListsAction = {
  type: typeof UPDATE_EVENTS_LISTS;
  data: EventListItem[];
};

type UpdateEventsVerificationAction = {
  type: typeof UPDATE_EVENTS_VERIFICATION;
  data: EventVerificationPreload[];
};

type UpdateEventsReadAction = {
  type: typeof UPDATE_EVENTS_READ;
  data: EventReadItem[];
};

type UpdateEventsPrefsAction = {
  type: typeof UPDATE_EVENTS_PREFS;
  data: { hidden?: string[]; default?: string };
};

type UpdateEventsQuicksAction = {
  type: typeof UPDATE_EVENTS_QUICKS;
  data: EventQuickItem[];
};

type UpdateEventsCreationDataAction = {
  type: typeof UPDATE_EVENTS_CREATION_DATA;
  data: Partial<EventCreationData>;
};

type ClearEventsAction = {
  type: typeof CLEAR_EVENTS;
  data: { data?: boolean; search?: boolean; verification?: boolean; following?: boolean };
};

export type EventsActionTypes =
  | UpdateEventsStateAction
  | UpdateEventsUpcomingDataAction
  | UpdateEventsPassedDataAction
  | UpdateEventsItemAction
  | UpdateEventsSearchAction
  | UpdateEventsVerificationAction
  | UpdateEventsParamsAction
  | UpdateEventsListsAction
  | UpdateEventsFollowingAction
  | UpdateEventsReadAction
  | UpdateEventsPrefsAction
  | UpdateEventsQuicksAction
  | UpdateEventsCreationDataAction
  | ClearEventsAction;

// Groups
export const UPDATE_GROUPS_STATE = 'UPDATE_GROUPS_STATE';
export const UPDATE_GROUPS_DATA = 'UPDATE_GROUPS_DATA';
export const UPDATE_GROUPS_ITEM = 'UPDATE_GROUPS_ITEM';
export const UPDATE_GROUPS_SEARCH = 'UPDATE_GROUPS_SEARCH';
export const UPDATE_GROUPS_TEMPLATES = 'UPDATE_GROUPS_TEMPLATES';
export const UPDATE_GROUPS_CREATION_DATA = 'UPDATE_GROUPS_CREATION_DATA';
export const UPDATE_GROUPS_VERIFICATION = 'UPDATE_GROUPS_VERIFICATION';
export const CLEAR_GROUPS = 'CLEAR_GROUPS';

export type GroupsState = {
  data: (Group | GroupPreload)[];
  search: GroupPreload[];
  item: Group | null;
  verification: (Group | GroupPreload)[];
  state: GroupRequestState;
  templates: GroupTemplate[];
};

export type GroupCreationData = {
  name?: string;
  type?: string;
  location?: {
    schools?: string[];
    departments?: string[];
    global?: boolean;
  };
  shortName?: Date;
  description?: string;
  summary?: string;
};

export type GroupsDataState = {
  creationData: GroupCreationData;
};

type UpdateGroupsStateAction = {
  type: typeof UPDATE_GROUPS_STATE;
  data: Partial<GroupRequestState>;
};

type UpdateGroupsDataAction = {
  type: typeof UPDATE_GROUPS_DATA;
  data: (Group | GroupPreload)[];
};

type UpdateGroupsItemAction = {
  type: typeof UPDATE_GROUPS_ITEM;
  data: Group;
};

type UpdateGroupsTemplatesAction = {
  type: typeof UPDATE_GROUPS_TEMPLATES;
  data: GroupTemplate[];
};

type UpdateGroupsCreationDataAction = {
  type: typeof UPDATE_GROUPS_CREATION_DATA;
  data: Partial<GroupCreationData>;
};

type UpdateGroupsVerificationAction = {
  type: typeof UPDATE_GROUPS_VERIFICATION;
  data: GroupPreload[];
};

type UpdateGroupsSearchAction = {
  type: typeof UPDATE_GROUPS_SEARCH;
  data: GroupPreload[];
};

type ClearGroupsAction = {
  type: typeof CLEAR_GROUPS;
  data: { data?: boolean; search?: boolean; templates?: boolean; verification?: boolean };
};

export type GroupsActionTypes =
  | UpdateGroupsStateAction
  | UpdateGroupsDataAction
  | UpdateGroupsItemAction
  | UpdateGroupsSearchAction
  | UpdateGroupsCreationDataAction
  | UpdateGroupsTemplatesAction
  | UpdateGroupsVerificationAction
  | ClearGroupsAction;

// Petitions
export const UPDATE_PETITIONS_STATE = 'UPDATE_PETITIONS_STATE';
export const UPDATE_PETITIONS_DATA = 'UPDATE_PETITIONS_DATA';
export const UPDATE_PETITIONS_ITEM = 'UPDATE_PETITIONS_ITEM';
export const UPDATE_PETITIONS_SEARCH = 'UPDATE_PETITIONS_SEARCH';
export const CLEAR_PETITIONS = 'CLEAR_PETITIONS';

export type PetitionsState = {
  data: (Petition | PetitionPreload)[];
  search: PetitionPreload[];
  item: Petition | null;
  state: PetitionRequestState;
};

type UpdatePetitionsStateAction = {
  type: typeof UPDATE_PETITIONS_STATE;
  data: Partial<PetitionRequestState>;
};

type UpdatePetitionsDataAction = {
  type: typeof UPDATE_PETITIONS_DATA;
  data: (Petition | PetitionPreload)[];
};

type UpdatePetitionsItemAction = {
  type: typeof UPDATE_PETITIONS_ITEM;
  data: Petition;
};

type UpdatePetitionsSearchAction = {
  type: typeof UPDATE_PETITIONS_SEARCH;
  data: PetitionPreload[];
};

type ClearPetitionsAction = {
  type: typeof CLEAR_PETITIONS;
  data: { data?: boolean; search?: boolean };
};

export type PetitionsActionTypes =
  | UpdatePetitionsStateAction
  | UpdatePetitionsDataAction
  | UpdatePetitionsItemAction
  | UpdatePetitionsSearchAction
  | ClearPetitionsAction;

// Places
export const UPDATE_PLACES_STATE = 'UPDATE_PLACES_STATE';
export const UPDATE_PLACES_DATA = 'UPDATE_PLACES_DATA';
export const UPDATE_PLACES_ITEM = 'UPDATE_PLACES_ITEM';
export const UPDATE_PLACES_SEARCH = 'UPDATE_PLACES_SEARCH';
export const CLEAR_PLACES = 'CLEAR_PLACES';

export type PlacesState = {
  data: (Place | PlacePreload)[];
  search: PlacePreload[];
  item: Place | null;
  state: PlaceRequestState;
};

type UpdatePlacesStateAction = {
  type: typeof UPDATE_PLACES_STATE;
  data: Partial<PlaceRequestState>;
};

type UpdatePlacesDataAction = {
  type: typeof UPDATE_PLACES_DATA;
  data: (Place | PlacePreload)[];
};

type UpdatePlacesItemAction = {
  type: typeof UPDATE_PLACES_ITEM;
  data: Place;
};

type UpdatePlacesSearchAction = {
  type: typeof UPDATE_PLACES_SEARCH;
  data: PlacePreload[];
};

type ClearPlacesAction = {
  type: typeof CLEAR_PLACES;
  data: { data?: boolean; search?: boolean };
};

export type PlacesActionTypes =
  | UpdatePlacesStateAction
  | UpdatePlacesDataAction
  | UpdatePlacesItemAction
  | UpdatePlacesSearchAction
  | ClearPlacesAction;

// Schools
export const UPDATE_SCHOOLS_STATE = 'UPDATE_SCHOOLS_STATE';
export const UPDATE_SCHOOLS_DATA = 'UPDATE_SCHOOLS_DATA';
export const UPDATE_SCHOOLS_ITEM = 'UPDATE_SCHOOLS_ITEM';
export const UPDATE_SCHOOLS_ITEMS = 'UPDATE_SCHOOLS_ITEMS';
export const UPDATE_SCHOOLS_SEARCH = 'UPDATE_SCHOOLS_SEARCH';
export const UPDATE_SCHOOLS_NEAR = 'UPDATE_SCHOOLS_NEAR';
export const CLEAR_SCHOOLS = 'CLEAR_SCHOOLS';

export type SchoolsState = {
  data: (School | SchoolPreload)[];
  search: SchoolPreload[];
  item: School | null;
  items: School[];
  state: SchoolRequestState;
  near: SchoolPreload[];
};

type UpdateSchoolsStateAction = {
  type: typeof UPDATE_SCHOOLS_STATE;
  data: Partial<SchoolRequestState>;
};

type UpdateSchoolsDataAction = {
  type: typeof UPDATE_SCHOOLS_DATA;
  data: (School | SchoolPreload)[];
};

type UpdateSchoolsItemAction = {
  type: typeof UPDATE_SCHOOLS_ITEM;
  data: School;
};

type UpdateSchoolsItemsAction = {
  type: typeof UPDATE_SCHOOLS_ITEMS;
  data: School[];
};

type UpdateSchoolsSearchAction = {
  type: typeof UPDATE_SCHOOLS_SEARCH;
  data: SchoolPreload[];
};

type UpdateSchoolsNearAction = {
  type: typeof UPDATE_SCHOOLS_NEAR;
  data: SchoolPreload[];
};

type ClearSchoolsAction = {
  type: typeof CLEAR_SCHOOLS;
  data: { data?: boolean; search?: boolean; near?: boolean };
};

export type SchoolsActionTypes =
  | UpdateSchoolsStateAction
  | UpdateSchoolsDataAction
  | UpdateSchoolsItemAction
  | UpdateSchoolsItemsAction
  | UpdateSchoolsSearchAction
  | UpdateSchoolsNearAction
  | ClearSchoolsAction;

// Tags
export const UPDATE_TAGS_STATE = 'UPDATE_TAGS_STATE';
export const UPDATE_TAGS_DATA = 'UPDATE_TAGS_DATA';
export const UPDATE_TAGS_ITEM = 'UPDATE_TAGS_ITEM';
export const UPDATE_TAGS_SEARCH = 'UPDATE_TAGS_SEARCH';
export const CLEAR_TAGS = 'CLEAR_TAGS';

export type TagsState = {
  data: (Tag | TagPreload)[];
  search: TagPreload[];
  item: Tag | null;
  state: TagRequestState;
};

type UpdateTagsStateAction = {
  type: typeof UPDATE_TAGS_STATE;
  data: Partial<TagRequestState>;
};

type UpdateTagsDataAction = {
  type: typeof UPDATE_TAGS_DATA;
  data: (Tag | TagPreload)[];
};

type UpdateTagsItemAction = {
  type: typeof UPDATE_TAGS_ITEM;
  data: Tag;
};

type UpdateTagsSearchAction = {
  type: typeof UPDATE_TAGS_SEARCH;
  data: TagPreload[];
};

type ClearTagsAction = {
  type: typeof CLEAR_TAGS;
  data: { data?: boolean; search?: boolean };
};

export type TagsActionTypes =
  | UpdateTagsStateAction
  | UpdateTagsDataAction
  | UpdateTagsItemAction
  | UpdateTagsSearchAction
  | ClearTagsAction;

// User
export const UPDATE_USERS_STATE = 'UPDATE_USERS_STATE';
export const UPDATE_USERS_DATA = 'UPDATE_USERS_DATA';
export const UPDATE_USERS_ITEM = 'UPDATE_USERS_ITEM';
export const UPDATE_USERS_SEARCH = 'UPDATE_USERS_SEARCH';
export const CLEAR_USERS = 'CLEAR_USERS';

export type UsersState = {
  data: (User | UserPreload)[];
  search: UserPreload[];
  item: User | null;
  state: UserRequestState;
};

type UpdateUsersStateAction = {
  type: typeof UPDATE_USERS_STATE;
  data: Partial<UserRequestState>;
};

type UpdateUsersDataAction = {
  type: typeof UPDATE_USERS_DATA;
  data: (User | UserPreload)[];
};

type UpdateUsersItemAction = {
  type: typeof UPDATE_USERS_ITEM;
  data: User;
};

type UpdateUsersSearchAction = {
  type: typeof UPDATE_USERS_SEARCH;
  data: UserPreload[];
};

type ClearUsersAction = {
  type: typeof CLEAR_USERS;
  data: { data?: boolean; search?: boolean };
};

export type UsersActionTypes =
  | UpdateUsersStateAction
  | UpdateUsersDataAction
  | UpdateUsersItemAction
  | UpdateUsersSearchAction
  | ClearUsersAction;

export const UPDATE_LEGAL_STATE = 'UPDATE_LEGAL_STATE';
export const UPDATE_LEGAL = 'UPDATE_LEGAL';

export type LegalState = {
  conditions: string;
  confidentialite: string;
  mentions: string;
  state: LegalRequestState;
};

type UpdateLegalStateAction = {
  type: typeof UPDATE_LEGAL_STATE;
  data: Partial<LegalRequestState>;
};

type UpdateLegalAction = {
  type: typeof UPDATE_LEGAL;
  data: Partial<LegalState>;
};

export type LegalActionTypes = UpdateLegalAction | UpdateLegalStateAction;

// Linking
export const UPDATE_LINKING_STATE = 'UPDATE_LINKING_STATE';
export type LinkingState = {
  state: LinkingRequestState;
};

type UpdateLinkingStateAction = {
  type: typeof UPDATE_LINKING_STATE;
  data: Partial<LinkingRequestState>;
};
export type LinkingActionTypes = UpdateLinkingStateAction;

// Upload
export const UPDATE_UPLOAD_STATE = 'UPDATE_UPLOAD_STATE';
export type UploadState = {
  state: UploadRequestState;
};

type UpdateUploadStateAction = {
  type: typeof UPDATE_UPLOAD_STATE;
  data: Partial<UploadRequestState>;
};

export type UploadActionTypes = UpdateUploadStateAction;

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

type UpdateLocationAction = {
  type: typeof UPDATE_LOCATION;
  data: Partial<LocationList>;
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

// Actions
export type ActionType =
  | ArticlesActionTypes
  | EventsActionTypes
  | CommentsActionTypes
  | SchoolsActionTypes
  | DepartmentsActionTypes
  | UsersActionTypes
  | GroupsActionTypes
  | PetitionsActionTypes
  | TagsActionTypes
  | PlacesActionTypes
  | LegalActionTypes
  | AccountActionTypes
  | LocationActionTypes
  | PrefActionTypes;

// Global stuff
export type ReduxLocation = {
  global: boolean;
  schools: string[];
  departments: string[];
};

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
  youtubeConsent: boolean;
};

export type LocationList = {
  selected: boolean;
  global: boolean;
  schools: string[];
  schoolData: SchoolPreload[];
  departments: string[];
  departmentData: DepartmentPreload[];
  state: LocationRequestState;
};

export type ModalProps = {
  visible: boolean;
  setVisible: (state: boolean) => void;
};

export type ElementString =
  | 'article'
  | 'comment'
  | 'department'
  | 'group'
  | 'event'
  | 'petition'
  | 'place'
  | 'tag'
  | 'school'
  | 'user';
export type ElementDataString =
  | 'articleData'
  | 'eventData'
  // | 'petitionData'
  // | 'placeData'
  | 'groupData';

export type ElementStringPluralMap = {
  articles: Article;
  comments: Comment;
  departments: Department;
  groups: Group;
  events: Event;
  petitions: Petition;
  places: Place;
  tags: Tag;
  schools: School;
  users: User;
};
export type ElementStringPlural = keyof ElementStringPluralMap;

export type ListItem = ArticleListItem | EventListItem;
