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
  EventVerificationPreload,
  ArticleVerificationPreload,
  GroupVerification,
  MapLocation,
  ArticleMyInfo,
  EventMyInfo,
} from '../api';
import { Footer, Header, Page } from '../groupPages';
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
  LinkingRequestState,
  UploadRequestState,
} from '../requestState';
import { FullClearAction } from './actions';

// Articles
export const UPDATE_ARTICLES_STATE = 'UPDATE_ARTICLES_STATE';
export const UPDATE_ARTICLES_DATA = 'UPDATE_ARTICLES_DATA';
export const UPDATE_ARTICLES_ITEM = 'UPDATE_ARTICLES_ITEM';
export const UPDATE_ARTICLES_MY_INFO = 'UPDATE_ARTICLES_MY_INFO';
export const UPDATE_ARTICLES_FOLLOWING = 'UPDATE_ARTICLES_FOLLOWING';
export const UPDATE_ARTICLES_VERIFICATION = 'UPDATE_ARTICLES_VERIFICATION';
export const UPDATE_ARTICLES_SEARCH = 'UPDATE_ARTICLES_SEARCH';
export const CLEAR_ARTICLES = 'CLEAR_ARTICLES';

export type ArticlesState = {
  data: ArticlePreload[];
  following: ArticlePreload[];
  item: Article | null;
  my: ArticleMyInfo | null;
  search: ArticlePreload[];
  verification: ArticleVerificationPreload[];
  state: ArticleRequestState;
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

type UpdateArticlesMyInfoAction = {
  type: typeof UPDATE_ARTICLES_MY_INFO;
  data: ArticleMyInfo;
};

type UpdateArticlesVerificationAction = {
  type: typeof UPDATE_ARTICLES_VERIFICATION;
  data: ArticleVerificationPreload[];
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
  | UpdateArticlesMyInfoAction
  | UpdateArticlesVerificationAction
  | ClearArticlesAction
  | FullClearAction;

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
  | ClearCommentsAction
  | FullClearAction;

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
  | ClearDepartmentsAction
  | FullClearAction;

// Events
export const UPDATE_EVENTS_STATE = 'UPDATE_EVENTS_STATE';
export const UPDATE_EVENTS_UPCOMING_DATA = 'UPDATE_EVENTS_UPCOMING_DATA';
export const UPDATE_EVENTS_PASSED_DATA = 'UPDATE_EVENTS_PASSED_DATA';
export const UPDATE_EVENTS_ITEM = 'UPDATE_EVENTS_ITEM';
export const UPDATE_EVENTS_VERIFICATION = 'UPDATE_EVENTS_VERIFICATION';
export const UPDATE_EVENTS_MY_INFO = 'UPDATE_EVENTS_MY_INFO';
export const UPDATE_EVENTS_FOLLOWING = 'UPDATE_EVENTS_FOLLOWING';
export const UPDATE_EVENTS_SEARCH = 'UPDATE_EVENTS_SEARCH';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';

export type EventsState = {
  dataUpcoming: EventPreload[];
  dataPassed: EventPreload[];
  following: EventPreload[];
  item: Event | null;
  my: EventMyInfo | null;
  search: EventPreload[];
  verification: EventVerificationPreload[];
  state: EventRequestState;
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

type UpdateEventsMyInfoAction = {
  type: typeof UPDATE_EVENTS_MY_INFO;
  data: EventMyInfo;
};

type UpdateEventsSearchAction = {
  type: typeof UPDATE_EVENTS_SEARCH;
  data: EventPreload[];
};

type UpdateEventsVerificationAction = {
  type: typeof UPDATE_EVENTS_VERIFICATION;
  data: EventVerificationPreload[];
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
  | UpdateEventsMyInfoAction
  | UpdateEventsSearchAction
  | UpdateEventsVerificationAction
  | UpdateEventsFollowingAction
  | ClearEventsAction
  | FullClearAction;

// Groups
export const UPDATE_GROUPS_STATE = 'UPDATE_GROUPS_STATE';
export const UPDATE_GROUPS_DATA = 'UPDATE_GROUPS_DATA';
export const UPDATE_GROUPS_ITEM = 'UPDATE_GROUPS_ITEM';
export const UPDATE_GROUPS_SEARCH = 'UPDATE_GROUPS_SEARCH';
export const UPDATE_GROUPS_TEMPLATES = 'UPDATE_GROUPS_TEMPLATES';
export const UPDATE_GROUPS_VERIFICATION = 'UPDATE_GROUPS_VERIFICATION';
export const UPDATE_GROUPS_PAGES = 'UPDATE_GROUPS_PAGES';
export const CLEAR_GROUPS = 'CLEAR_GROUPS';

export type GroupsState = {
  data: (GroupPreload | Group)[];
  search: (GroupPreload | Group)[];
  item: Group | GroupVerification | null;
  verification: (Group | GroupPreload)[];
  state: GroupRequestState;
  templates: GroupTemplate[];
  pages: {
    headers: Header[];
    footers: Footer[];
    pages: Page[];
  };
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

type UpdateGroupsVerificationAction = {
  type: typeof UPDATE_GROUPS_VERIFICATION;
  data: GroupPreload[];
};

type UpdateGroupsSearchAction = {
  type: typeof UPDATE_GROUPS_SEARCH;
  data: GroupPreload[];
};

type UpdateGroupsPagesAction = {
  type: typeof UPDATE_GROUPS_PAGES;
  data: {
    headers: Header[];
    footers: Footer[];
    pages: Page[];
  };
};

type ClearGroupsAction = {
  type: typeof CLEAR_GROUPS;
  data: {
    data?: boolean;
    search?: boolean;
    templates?: boolean;
    verification?: boolean;
    pages?: boolean;
  };
};

export type GroupsActionTypes =
  | UpdateGroupsStateAction
  | UpdateGroupsDataAction
  | UpdateGroupsItemAction
  | UpdateGroupsSearchAction
  | UpdateGroupsTemplatesAction
  | UpdateGroupsVerificationAction
  | UpdateGroupsPagesAction
  | ClearGroupsAction
  | FullClearAction;

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
  | ClearPetitionsAction
  | FullClearAction;

// Places
export const UPDATE_PLACES_STATE = 'UPDATE_PLACES_STATE';
export const UPDATE_PLACES_DATA = 'UPDATE_PLACES_DATA';
export const UPDATE_PLACES_MAP_DATA = 'UPDATE_PLACES_MAP_DATA';
export const UPDATE_PLACES_ITEM = 'UPDATE_PLACES_ITEM';
export const UPDATE_PLACES_SEARCH = 'UPDATE_PLACES_SEARCH';
export const CLEAR_PLACES = 'CLEAR_PLACES';

export type PlacesState = {
  data: (Place | PlacePreload)[];
  mapData: MapLocation.FullLocation[];
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

type UpdatePlacesMapDataAction = {
  type: typeof UPDATE_PLACES_MAP_DATA;
  data: MapLocation.FullLocation[];
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
  data: { data?: boolean; search?: boolean; mapData?: boolean };
};

export type PlacesActionTypes =
  | UpdatePlacesStateAction
  | UpdatePlacesDataAction
  | UpdatePlacesMapDataAction
  | UpdatePlacesItemAction
  | UpdatePlacesSearchAction
  | ClearPlacesAction
  | FullClearAction;

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
  | ClearSchoolsAction
  | FullClearAction;

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
  | ClearTagsAction
  | FullClearAction;

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
  | ClearUsersAction
  | FullClearAction;

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

export namespace ApiAction {
  // Not exported
  type ActionMap = {
    articles: ArticlesActionTypes;
    comments: CommentsActionTypes;
    departments: DepartmentsActionTypes;
    groups: GroupsActionTypes;
    events: EventsActionTypes;
    petitions: PetitionsActionTypes;
    places: PlacesActionTypes;
    tags: TagsActionTypes;
    schools: SchoolsActionTypes;
    users: UsersActionTypes;
  };

  export type TypeMap = {
    [K in keyof ActionMap]: ActionMap[K]['type'];
  };

  // Not exported
  type StateActionMap = {
    articles: UpdateArticlesStateAction;
    comments: UpdateCommentsStateAction;
    departments: UpdateDepartmentsStateAction;
    groups: UpdateGroupsStateAction;
    events: UpdateEventsStateAction;
    petitions: UpdatePetitionsStateAction;
    places: UpdatePlacesStateAction;
    tags: UpdateTagsStateAction;
    schools: UpdateSchoolsStateAction;
    users: UpdateUsersStateAction;
  };

  export type UpdateStateTypeMap = {
    [K in keyof StateActionMap]: StateActionMap[K]['type'];
  };

  export type UpdateStateType = UpdateStateTypeMap[keyof UpdateStateTypeMap];

  export type UpdateStateNameMap = {
    [K in keyof StateActionMap]: keyof StateActionMap[K]['data'];
  };

  export type ClearActionMap = {
    articles: ClearArticlesAction;
    comments: ClearCommentsAction;
    departments: ClearDepartmentsAction;
    groups: ClearGroupsAction;
    events: ClearEventsAction;
    petitions: ClearPetitionsAction;
    places: ClearPlacesAction;
    tags: ClearTagsAction;
    schools: ClearSchoolsAction;
    users: ClearUsersAction;
  };

  export type ClearTypeMap = {
    [K in keyof ClearActionMap]: ClearActionMap[K]['type'];
  };

  export type ClearDataMap = {
    [K in keyof ClearActionMap]: ClearActionMap[K]['data'];
  };
}
