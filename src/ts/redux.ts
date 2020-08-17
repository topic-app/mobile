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
} from './requestState';

// Articles
export const UPDATE_ARTICLES_STATE = 'UPDATE_ARTICLES_STATE';
export const UPDATE_ARTICLES_DATA = 'UPDATE_ARTICLES_DATA';
export const UPDATE_ARTICLES_ITEM = 'UPDATE_ARTICLES_ITEM';
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
  type: 'tag' | 'user' | 'group';
  id: string;
  title: string;
};

export type ArticlesState = {
  data: ArticlePreload[];
  item: Article | null;
  search: ArticlePreload[];
  verification: ArticlePreload[];
  state: ArticleRequestState;
  creationData: ArticleCreationData;
};

export type ArticlePrefs = {
  categories?: string[];
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
  title?: string;
  summary?: string;
  tags?: string[];
  content?: {
    parser: 'plaintext' | 'markdown';
    data: string;
  };
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
  data: ArticleRequestState;
};

type UpdateArticlesDataAction = {
  type: typeof UPDATE_ARTICLES_DATA;
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
  data: ArticlePreload[];
};

type UpdateArticlesReadAction = {
  type: typeof UPDATE_ARTICLES_READ;
  data: { id: string }[];
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
  data: ArticleCreationData;
};

type ClearArticlesAction = {
  type: typeof CLEAR_ARTICLES;
  data: { data?: boolean; search?: boolean; verification?: boolean };
};

export type ArticlesActionTypes =
  | UpdateArticlesStateAction
  | UpdateArticlesDataAction
  | UpdateArticlesItemAction
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
  data: CommentRequestState;
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
  data: DepartmentRequestState;
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
  data: { data?: boolean; search?: boolean };
};

export type DepartmentsActionTypes =
  | UpdateDepartmentsStateAction
  | UpdateDepartmentsDataAction
  | UpdateDepartmentsItemAction
  | UpdateDepartmentsItemsAction
  | UpdateDepartmentsSearchAction
  | ClearDepartmentsAction;

// Events
export const UPDATE_EVENTS_STATE = 'UPDATE_EVENTS_STATE';
export const UPDATE_EVENTS_DATA = 'UPDATE_EVENTS_DATA';
export const UPDATE_EVENTS_ITEM = 'UPDATE_EVENTS_ITEM';
export const UPDATE_EVENTS_SEARCH = 'UPDATE_EVENTS_SEARCH';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';

export type EventsState = {
  data: (Event | EventPreload)[];
  search: EventPreload[];
  item: Event | null;
  state: EventRequestState;
};

type UpdateEventsStateAction = {
  type: typeof UPDATE_EVENTS_STATE;
  data: EventRequestState;
};

type UpdateEventsDataAction = {
  type: typeof UPDATE_EVENTS_DATA;
  data: (Event | EventPreload)[];
};

type UpdateEventsItemAction = {
  type: typeof UPDATE_EVENTS_ITEM;
  data: Event;
};

type UpdateEventsSearchAction = {
  type: typeof UPDATE_EVENTS_SEARCH;
  data: EventPreload[];
};

type ClearEventsAction = {
  type: typeof CLEAR_EVENTS;
  data: { data?: boolean; search?: boolean };
};

export type EventsActionTypes =
  | UpdateEventsStateAction
  | UpdateEventsDataAction
  | UpdateEventsItemAction
  | UpdateEventsSearchAction
  | ClearEventsAction;

// Groups
export const UPDATE_GROUPS_STATE = 'UPDATE_GROUPS_STATE';
export const UPDATE_GROUPS_DATA = 'UPDATE_GROUPS_DATA';
export const UPDATE_GROUPS_ITEM = 'UPDATE_GROUPS_ITEM';
export const UPDATE_GROUPS_SEARCH = 'UPDATE_GROUPS_SEARCH';
export const CLEAR_GROUPS = 'CLEAR_GROUPS';

export type GroupsState = {
  data: (Group | GroupPreload)[];
  search: GroupPreload[];
  item: Group | null;
  state: GroupRequestState;
};

type UpdateGroupsStateAction = {
  type: typeof UPDATE_GROUPS_STATE;
  data: GroupRequestState;
};

type UpdateGroupsDataAction = {
  type: typeof UPDATE_GROUPS_DATA;
  data: (Group | GroupPreload)[];
};

type UpdateGroupsItemAction = {
  type: typeof UPDATE_GROUPS_ITEM;
  data: Group;
};

type UpdateGroupsSearchAction = {
  type: typeof UPDATE_GROUPS_SEARCH;
  data: GroupPreload[];
};

type ClearGroupsAction = {
  type: typeof CLEAR_GROUPS;
  data: { data?: boolean; search?: boolean };
};

export type GroupsActionTypes =
  | UpdateGroupsStateAction
  | UpdateGroupsDataAction
  | UpdateGroupsItemAction
  | UpdateGroupsSearchAction
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
  data: PetitionRequestState;
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
  data: PlaceRequestState;
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
export const CLEAR_SCHOOLS = 'CLEAR_SCHOOLS';

export type SchoolsState = {
  data: (School | SchoolPreload)[];
  search: SchoolPreload[];
  item: School | null;
  items: School[];
  state: SchoolRequestState;
};

type UpdateSchoolsStateAction = {
  type: typeof UPDATE_SCHOOLS_STATE;
  data: SchoolRequestState;
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

type ClearSchoolsAction = {
  type: typeof CLEAR_SCHOOLS;
  data: { data?: boolean; search?: boolean };
};

export type SchoolsActionTypes =
  | UpdateSchoolsStateAction
  | UpdateSchoolsDataAction
  | UpdateSchoolsItemAction
  | UpdateSchoolsItemsAction
  | UpdateSchoolsSearchAction
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
  data: TagRequestState;
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
  data: UserRequestState;
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
