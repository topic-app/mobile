import { Article, Event } from '../api';
import { ApiAction } from './apiReducers';

// Articles
export const UPDATE_ARTICLES_PARAMS = 'UPDATE_ARTICLES_PARAMS';
export const UPDATE_ARTICLES_LISTS = 'UPDATE_ARTICLES_LISTS';
export const UPDATE_ARTICLES_READ = 'UPDATE_ARTICLES_READ';
export const UPDATE_ARTICLES_PREFS = 'UPDATE_ARTICLES_PREFS';
export const UPDATE_ARTICLES_QUICKS = 'UPDATE_ARTICLES_QUICKS';
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
  parser?: 'plaintext' | 'markdown';
  data?: string;
};

export type ArticlesContentState = {
  params: ArticleParams;
  lists: ArticleListItem[];
  prefs: ArticlePrefs;
  read: ArticleReadItem[];
  quicks: ArticleQuickItem[];
  creationData: ArticleCreationData;
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
  | UpdateArticlesCreationDataAction;

// Events
export const UPDATE_EVENTS_PARAMS = 'UPDATE_EVENTS_PARAMS';
export const UPDATE_EVENTS_LISTS = 'UPDATE_EVENTS_LISTS';
export const UPDATE_EVENTS_READ = 'UPDATE_EVENTS_READ';
export const UPDATE_EVENTS_PREFS = 'UPDATE_EVENTS_PREFS';
export const UPDATE_EVENTS_QUICKS = 'UPDATE_EVENTS_QUICKS';
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

export type EventsContentState = {
  params: EventParams;
  lists: EventListItem[];
  prefs: EventPrefs;
  read: EventReadItem[];
  quicks: EventQuickItem[];
  creationData: EventCreationData;
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
  | UpdateEventsCreationDataAction;

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
  shortName?: Date;
  description?: string;
  summary?: string;
};

export type GroupsContentState = {
  creationData: GroupCreationData;
};

type UpdateGroupsCreationDataAction = {
  type: typeof UPDATE_GROUPS_CREATION_DATA;
  data: Partial<GroupCreationData>;
};

export type GroupsContentActionTypes = UpdateGroupsCreationDataAction;

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