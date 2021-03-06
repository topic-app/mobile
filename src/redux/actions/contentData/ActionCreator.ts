import { AnyAction } from 'redux';
import shortid from 'shortid';

import { Config } from '@constants';
import Store from '@redux/store';
import {
  ApiItemString,
  ApiItem,
  ArticleReadItem,
  EventReadItem,
  ContentAction,
  AppThunk,
  ContentItemMap,
  ContentItemString,
} from '@ts/types';
import { request } from '@utils';

type ContentItemWithListsString = 'articleData' | 'eventData';

type AddReadCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  data: ArticleReadItem | EventReadItem;
};

function addReadCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  data,
}: AddReadCreatorParams<T>): AnyAction {
  const { read } = Store.getState()[dataType];
  return {
    type: update,
    data: [...read, data],
  };
}

type DeleteReadCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  key: string;
};
function deleteReadCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  key,
}: DeleteReadCreatorParams<T>): AnyAction {
  return {
    type: update,
    data: Store.getState()[dataType].read.filter((i) => i.key !== key),
  };
}

type DeleteReadAllCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
  id: string;
};
function deleteReadAllCreator<T extends ContentItemWithListsString>({
  update,
  dataType,
  id,
}: DeleteReadAllCreatorParams<T>): AnyAction {
  return {
    type: update,
    data: Store.getState()[dataType].read.filter((i) => i.id !== id),
  };
}

type ClearReadCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  update: ContentAction.TypeMap[T];
};
function clearReadCreator<T extends ContentItemWithListsString>({
  dataType,
  update,
}: ClearReadCreatorParams<T>): AnyAction {
  return {
    type: update,
    data: [],
  };
}

type UpdatePrefsCreatorParams<T extends ContentItemWithListsString> = {
  updatePrefs: ContentAction.UpdatePrefsTypeMap[T];
  prefs: ContentAction.UpdatePrefsDataMap[T];
};
function updatePrefsCreator<T extends ContentItemWithListsString>({
  updatePrefs,
  prefs,
}: UpdatePrefsCreatorParams<T>): AnyAction {
  return {
    type: updatePrefs,
    data: prefs,
  };
}

type AddQuickCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  updateQuicks: ContentAction.UpdateQuicksTypeMap[T];
  type: string;
  id: string;
  title: string;
};
function addQuickCreator<T extends ContentItemWithListsString>({
  updateQuicks,
  dataType,
  type,
  id,
  title,
}: AddQuickCreatorParams<T>): AnyAction {
  const { quicks } = Store.getState()[dataType];
  if (quicks.some((q) => q.id === id)) {
    // Do nothing
    return {
      type: updateQuicks,
      data: quicks,
    };
  }
  return {
    type: updateQuicks,
    data: [...quicks, { id, type, title }],
  };
}

type ReorderQuickCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  updateQuicks: ContentAction.UpdateQuicksTypeMap[T];
  from: string;
  to: string;
};
function reorderQuickCreator<T extends ContentItemWithListsString>({
  updateQuicks,
  dataType,
  from,
  to,
}: ReorderQuickCreatorParams<T>): AnyAction {
  const { quicks } = Store.getState()[dataType];
  const fromQuick = quicks.find((q) => q.id === from);
  const toQuick = quicks.find((q) => q.id === to);
  if (!fromQuick || !toQuick) {
    throw new Error('Non existent quick');
  }
  return {
    type: updateQuicks,
    data: quicks.map((q) => {
      if (q.id === from) {
        return toQuick;
      } else if (q.id === to) {
        return fromQuick;
      } else {
        return q;
      }
    }),
  };
}

type DeleteQuickCreatorParams<T extends ContentItemWithListsString> = {
  dataType: T;
  updateQuicks: ContentAction.UpdateQuicksTypeMap[T];
  id: string;
};
function deleteQuickCreator<T extends ContentItemWithListsString>({
  updateQuicks,
  dataType,
  id,
}: DeleteQuickCreatorParams<T>): AnyAction {
  return {
    type: updateQuicks,
    data: Store.getState()[dataType].quicks.filter((q) => q.id !== id),
  };
}

type UpdateCreationDataCreatorParams<T extends ContentItemString> = {
  dataType: T;
  updateCreationData: ContentAction.UpdateCreationDataTypeMap[T];
  fields: ContentAction.UpdateCreationDataDataMap[T];
};

function updateCreationDataCreator<T extends ContentItemString>({
  updateCreationData,
  fields,
  dataType,
}: UpdateCreationDataCreatorParams<T>): AnyAction {
  return {
    type: updateCreationData,
    data: { ...Store.getState()[dataType].creationData, ...fields },
  };
}

type ClearCreationDataCreatorParams<T extends ContentItemString> = {
  dataType: T;
  updateCreationData: ContentAction.UpdateCreationDataTypeMap[T];
};
function clearCreationDataCreator<T extends ContentItemString>({
  dataType,
  updateCreationData,
}: ClearCreationDataCreatorParams<T>): AnyAction {
  return {
    type: updateCreationData,
    data: {},
  };
}

type UpdateRecommendationsCreator<T extends ContentItemWithListsString> = {
  dataType: T;
  updateRecommendations: ContentAction.UpdateRecommendationsDataMap[T];
  action: 'read' | 'mark' | 'list' | 'comment';
  tags?: string[];
  groups?: string[];
  users?: string[];
};
function updateRecommendationsCreator<T extends ContentItemWithListsString>({
  dataType,
  updateRecommendations,
  action,
  tags,
  groups,
  users,
}: UpdateRecommendationsCreator<T>) {
  const { recommendations } = Store.getState()[dataType];
  const values = Config.recommendations.values[action];
  if (tags) {
    tags.forEach((tagId) => {
      const index = recommendations.tags.findIndex((t) => t.id === tagId);
      if (index >= 0) {
        recommendations.tags[index] = {
          ...recommendations.tags[index],
          value: recommendations.tags[index].value + values.tags,
        };
      } else {
        recommendations.tags.push({ id: tagId, value: values.tags, frozen: false });
      }
    });
  }
  if (groups) {
    groups.forEach((groupId) => {
      const index = recommendations.groups.findIndex((t) => t.id === groupId);
      if (index >= 0) {
        recommendations.groups[index] = {
          ...recommendations.groups[index],
          value: recommendations.groups[index].value + values.groups,
        };
      } else {
        recommendations.groups.push({ id: groupId, value: values.groups, frozen: false });
      }
    });
  }
  if (users) {
    users.forEach((userId) => {
      const index = recommendations.users.findIndex((t) => t.id === userId);
      if (index >= 0) {
        recommendations.users[index] = {
          ...recommendations.users[index],
          value: recommendations.users[index].value + values.users,
        };
      } else {
        recommendations.users.push({ id: userId, value: values.users, frozen: false });
      }
    });
  }
  return {
    type: updateRecommendations,
    data: recommendations,
  };
}

export {
  addReadCreator,
  deleteReadCreator,
  deleteReadAllCreator,
  clearReadCreator,
  updatePrefsCreator,
  addQuickCreator,
  deleteQuickCreator,
  reorderQuickCreator,
  updateCreationDataCreator,
  clearCreationDataCreator,
  updateRecommendationsCreator,
};
