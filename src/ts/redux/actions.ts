import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Article, Comment, Department, Event, Group, Place, School, Tag, User } from '../api';
import { State } from '../types';
import {
  ArticlesActionTypes,
  CommentsActionTypes,
  DepartmentsActionTypes,
  EventsActionTypes,
  SchoolsActionTypes,
  UsersActionTypes,
  ArticlesState,
  CommentsState,
  DepartmentsState,
  EventsState,
  GroupsActionTypes,
  GroupsState,
  LegalActionTypes,
  PlacesActionTypes,
  PlacesState,
  SchoolsState,
  TagsActionTypes,
  TagsState,
  UsersState,
} from './apiReducers';
import { AccountActionTypes, LocationActionTypes, PrefActionTypes } from './dataReducers';

// Actions
export type ActionType =
  | ArticlesActionTypes
  | EventsActionTypes
  | CommentsActionTypes
  | SchoolsActionTypes
  | DepartmentsActionTypes
  | UsersActionTypes
  | GroupsActionTypes
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

export type ApiItemMap = {
  articles: Article;
  comments: Comment;
  departments: Department;
  groups: Group;
  events: Event;
  places: Place;
  tags: Tag;
  schools: School;
  users: User;
};
export type ApiItemString = keyof ApiItemMap;
export type ApiItem = ApiItemMap[ApiItemString];

export type ApiStateMap = {
  articles: ArticlesState;
  comments: CommentsState;
  departments: DepartmentsState;
  groups: GroupsState;
  events: EventsState;
  places: PlacesState;
  tags: TagsState;
  schools: SchoolsState;
  users: UsersState;
};

export type ContentItemMap = {
  articleData: Article;
  eventData: Event;
  groupData: Group;
};

export type AppThunk<ReturnType = unknown> = ThunkAction<ReturnType, State, unknown, AnyAction>;

export const FULL_CLEAR = 'FULL_CLEAR';

export type FullClearAction = {
  type: typeof FULL_CLEAR;
  data: {};
};
