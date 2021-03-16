import { Article, Event, Image, ProgramEntry, Address, TagPreload } from '../api';
import { FullClearAction } from './actions';
import { ApiAction } from './apiReducers';

// Articles
export const UPDATE_ARTICLES_PARAMS = 'UPDATE_ARTICLES_PARAMS';
export const UPDATE_ARTICLES_LISTS = 'UPDATE_ARTICLES_LISTS';
export const UPDATE_ARTICLES_READ = 'UPDATE_ARTICLES_READ';
export const UPDATE_ARTICLES_PREFS = 'UPDATE_ARTICLES_PREFS';
export const UPDATE_ARTICLES_QUICKS = 'UPDATE_ARTICLES_QUICKS';
export const UPDATE_ARTICLES_RECOMMENDATIONS = 'UPDATE_ARTICLES_RECOMMENDATIONS';
export const UPDATE_ARTICLES_CREATION_DATA = 'UPDATE_ARTICLES_CREATION_DATA';

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

export type ArticleRecommendationItem = {
  id: string;
  value: number;
  frozen: boolean;
};

export type ArticleRecommendations = {
  tags: ArticleRecommendationItem[];
  groups: ArticleRecommendationItem[];
  users: ArticleRecommendationItem[];
};

export type ArticleCreationData = {
  group?: string;
  location?: {
    schools?: string[];
    departments?: string[];
    global?: boolean;
  };
  opinion?: boolean;
  image?: Image | null;
  preferences?: {
    comments: boolean;
  };
  date?: Date;
  title?: string;
  summary?: string;
  tags?: string[];
  parser?: 'plaintext' | 'markdown';
  data?: string;
  tagData?: TagPreload[]; // For the editing
  editing?: boolean;
  id?: string;
};

export type ArticlesContentState = {
  params: ArticleParams;
  lists: ArticleListItem[];
  prefs: ArticlePrefs;
  read: ArticleReadItem[];
  quicks: ArticleQuickItem[];
  creationData: ArticleCreationData;
  recommendations: ArticleRecommendations;
};

type UpdateArticlesParamsAction = {
  type: typeof UPDATE_ARTICLES_PARAMS;
  data: Partial<ArticleParams>;
};

type UpdateArticlesListsAction = {
  type: typeof UPDATE_ARTICLES_LISTS;
  data: ArticleListItem[];
};

type UpdateArticlesReadAction = {
  type: typeof UPDATE_ARTICLES_READ;
  data: ArticleReadItem[];
};

type UpdateArticlesPrefsAction = {
  type: typeof UPDATE_ARTICLES_PREFS;
  data: Partial<ArticlePrefs>;
};

type UpdateArticlesRecommendationsAction = {
  type: typeof UPDATE_ARTICLES_RECOMMENDATIONS;
  data: Partial<ArticleRecommendations>;
};

type UpdateArticlesQuicksAction = {
  type: typeof UPDATE_ARTICLES_QUICKS;
  data: ArticleQuickItem[];
};

type UpdateArticlesCreationDataAction = {
  type: typeof UPDATE_ARTICLES_CREATION_DATA;
  data: Partial<ArticleCreationData>;
};

export type ArticlesContentActionTypes =
  | UpdateArticlesParamsAction
  | UpdateArticlesListsAction
  | UpdateArticlesReadAction
  | UpdateArticlesPrefsAction
  | UpdateArticlesQuicksAction
  | UpdateArticlesCreationDataAction
  | UpdateArticlesRecommendationsAction
  | FullClearAction;

// Events
export const UPDATE_EVENTS_PARAMS = 'UPDATE_EVENTS_PARAMS';
export const UPDATE_EVENTS_LISTS = 'UPDATE_EVENTS_LISTS';
export const UPDATE_EVENTS_READ = 'UPDATE_EVENTS_READ';
export const UPDATE_EVENTS_PREFS = 'UPDATE_EVENTS_PREFS';
export const UPDATE_EVENTS_QUICKS = 'UPDATE_EVENTS_QUICKS';
export const UPDATE_EVENTS_RECOMMENDATIONS = 'UPDATE_EVENTS_RECOMMENDATIONS';
export const UPDATE_EVENTS_CREATION_DATA = 'UPDATE_EVENTS_CREATION_DATA';

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
  type: 'tag' | 'user' | 'group' | 'school' | 'departement' | 'region' | 'global';
  id: string;
  title: string;
};

export type EventPrefs = {
  categories?: string[];
  hidden?: string[];
};

export type EventRecommendationItem = {
  id: string;
  value: number;
  frozen: boolean;
};

export type EventRecommendations = {
  tags: EventRecommendationItem[];
  users: EventRecommendationItem[];
  groups: EventRecommendationItem[];
};

export type EventReadItem = {
  id: string;
  title?: string;
  date?: Date;
  marked: boolean;
};

export type EventCreationDataPlace =
  | {
      id?: string;
      type: 'place';
      associatedPlace: string;
      address?: undefined;
      associatedSchool?: undefined;
      tempName?: string;
      link?: undefined;
    }
  | {
      id?: string;
      type: 'school';
      associatedSchool: string;
      address?: undefined;
      associatedPlace?: undefined;
      tempName?: string;
      link?: undefined;
    }
  | {
      id?: string;
      type: 'standalone';
      address: Address;
      tempName?: string;
      associatedPlace?: undefined;
      associatedSchool?: undefined;
      link?: undefined;
    }
  | {
      id?: string;
      type: 'online';
      address?: undefined;
      tempName?: string;
      associatedPlace?: undefined;
      associatedSchool?: undefined;
      link: string;
    };

export type EventCreationData = {
  title?: string;
  summary?: string;
  description?: string;
  data?: string;
  phone?: string;
  email?: string;
  contact?: {
    key: string;
    value: string;
    link: string;
  }[];
  members?: string[];
  start?: string | Date;
  end?: string | Date;
  date?: string | Date;
  location?: {
    schools?: string[];
    departments?: string[];
    global?: boolean;
  };
  group?: string;
  places?: EventCreationDataPlace[];
  parser?: 'markdown' | 'plaintext';
  preferences?: {
    comments?: boolean;
  };
  tags?: string[];
  tagData?: TagPreload[]; // For the editing
  image?: Image;
  program?: ProgramEntry[];
  editing?: boolean;
  id?: string;
};

export type EventsContentState = {
  params: EventParams;
  lists: EventListItem[];
  prefs: EventPrefs;
  read: EventReadItem[];
  quicks: EventQuickItem[];
  creationData: EventCreationData;
  recommendations: EventRecommendations;
};

type UpdateEventsParamsAction = {
  type: typeof UPDATE_EVENTS_PARAMS;
  data: Partial<EventParams>;
};

type UpdateEventsListsAction = {
  type: typeof UPDATE_EVENTS_LISTS;
  data: EventListItem[];
};

type UpdateEventsReadAction = {
  type: typeof UPDATE_EVENTS_READ;
  data: EventReadItem[];
};

type UpdateEventsPrefsAction = {
  type: typeof UPDATE_EVENTS_PREFS;
  data: Partial<EventPrefs>;
};

type UpdateEventsQuicksAction = {
  type: typeof UPDATE_EVENTS_QUICKS;
  data: EventQuickItem[];
};

type UpdateEventsRecommendationsAction = {
  type: typeof UPDATE_EVENTS_RECOMMENDATIONS;
  data: Partial<EventRecommendations>;
};

type UpdateEventsCreationDataAction = {
  type: typeof UPDATE_EVENTS_CREATION_DATA;
  data: Partial<EventCreationData>;
};

export type EventsContentActionTypes =
  | UpdateEventsParamsAction
  | UpdateEventsListsAction
  | UpdateEventsReadAction
  | UpdateEventsPrefsAction
  | UpdateEventsQuicksAction
  | UpdateEventsRecommendationsAction
  | UpdateEventsCreationDataAction
  | FullClearAction;

// Groups
export const UPDATE_GROUPS_CREATION_DATA = 'UPDATE_GROUPS_CREATION_DATA';

export type GroupCreationData = {
  name?: string;
  type?: string;
  location?: {
    schools?: string[];
    departments?: string[];
    global?: boolean;
  };
  shortName?: string;
  parser?: 'markdown' | 'plaintext';
  verification?: {
    name?: string;
    id?: string;
    extra?: string;
  };
  description?: string;
  locationName?: string;
  summary?: string;
  legal?: {
    id?: string;
    name?: string;
    address?: string;
    admin?: string;
    email?: string;
    website?: string;
    extra?: string;
    extraVerification?: string;
  };
};

export type GroupsContentState = {
  creationData: GroupCreationData;
};

type UpdateGroupsCreationDataAction = {
  type: typeof UPDATE_GROUPS_CREATION_DATA;
  data: Partial<GroupCreationData>;
};

export type GroupsContentActionTypes = UpdateGroupsCreationDataAction | FullClearAction;

export type ContentItemString = 'articleData' | 'eventData' | 'groupData';

export namespace ContentAction {
  // Not exported
  type ActionMap = {
    articleData: ArticlesContentActionTypes;
    eventData: EventsContentActionTypes;
    groupData: GroupsContentActionTypes;
  };

  export type TypeMap = {
    [K in keyof ActionMap]: ActionMap[K]['type'];
  };

  export type UpdateStateTypeMap = {
    articleData: ApiAction.UpdateStateTypeMap['articles'];
    eventData: ApiAction.UpdateStateTypeMap['events'];
    groupData: ApiAction.UpdateStateTypeMap['groups'];
  };

  export type UpdateStateType = UpdateStateTypeMap[keyof UpdateStateTypeMap];

  export type UpdateStateNameMap = {
    articleData: ApiAction.UpdateStateNameMap['articles'];
    eventData: ApiAction.UpdateStateNameMap['events'];
    groupData: ApiAction.UpdateStateNameMap['groups'];
  };

  type UpdateParamsActionMap = {
    articleData: UpdateArticlesParamsAction;
    eventData: UpdateEventsParamsAction;
  };

  export type UpdateParamsTypeMap = {
    [K in keyof UpdateParamsActionMap]: UpdateParamsActionMap[K]['type'];
  };
  export type UpdateParamsDataMap = {
    [K in keyof UpdateParamsActionMap]: UpdateParamsActionMap[K]['data'];
  };

  type UpdateRecommendationsActionMap = {
    articleData: UpdateArticlesRecommendationsAction;
    eventData: UpdateEventsRecommendationsAction;
  };
  export type UpdateRecommendationsTypeMap = {
    [K in keyof UpdateRecommendationsActionMap]: UpdateRecommendationsActionMap[K]['type'];
  };
  export type UpdateRecommendationsDataMap = {
    [K in keyof UpdateRecommendationsActionMap]: UpdateRecommendationsActionMap[K]['data'];
  };

  type UpdatePrefsActionMap = {
    articleData: UpdateArticlesPrefsAction;
    eventData: UpdateEventsPrefsAction;
  };

  export type UpdatePrefsTypeMap = {
    [K in keyof UpdatePrefsActionMap]: UpdatePrefsActionMap[K]['type'];
  };
  export type UpdatePrefsDataMap = {
    [K in keyof UpdatePrefsActionMap]: UpdatePrefsActionMap[K]['data'];
  };

  type UpdateQuicksActionMap = {
    articleData: UpdateArticlesQuicksAction;
    eventData: UpdateEventsQuicksAction;
  };

  export type UpdateQuicksTypeMap = {
    [K in keyof UpdateQuicksActionMap]: UpdateQuicksActionMap[K]['type'];
  };
  export type UpdateQuicksDataMap = {
    [K in keyof UpdateQuicksActionMap]: UpdateQuicksActionMap[K]['data'];
  };

  type UpdateCreationDataActionMap = {
    articleData: UpdateArticlesCreationDataAction;
    eventData: UpdateEventsCreationDataAction;
    groupData: UpdateGroupsCreationDataAction;
  };

  export type UpdateCreationDataTypeMap = {
    [K in keyof UpdateCreationDataActionMap]: UpdateCreationDataActionMap[K]['type'];
  };
  export type UpdateCreationDataDataMap = {
    [K in keyof UpdateCreationDataActionMap]: UpdateCreationDataActionMap[K]['data'];
  };
}
