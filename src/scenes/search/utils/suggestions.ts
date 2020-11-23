import { Location, TagPreload, GroupPreload } from '@ts/types';

const TAG_ICON = 'pound';
const DEPARTMENT_ICON = 'city';
const SCHOOL_ICON = 'school';
const GLOBAL_ICON = 'map-marker';
const GROUP_ICON = 'account-multiple';

export type SuggestionType = {
  key: string;
  title: string;
  icon: string;
  type: 'locations' | 'tags' | 'groups';
  color?: string;
};

export const mapSuggestions = (
  item: Location | TagPreload[] | GroupPreload[],
  type: 'locations' | 'tags' | 'groups',
): SuggestionType[] => {
  if (type === 'tags') {
    return (item as TagPreload[]).map((i) => ({
      key: i._id,
      title: i.displayName,
      icon: TAG_ICON,
      type,
    }));
  } else if (type === 'groups') {
    return (item as GroupPreload[]).map((i) => ({
      key: i._id,
      title: i.displayName,
      icon: GROUP_ICON,
      type,
    }));
  } else {
    const suggestions = [];
    if ((item as Location).global) {
      suggestions.push({
        key: 'location-global',
        title: 'France Entière',
        icon: GLOBAL_ICON,
        type,
      });
    }
    (item as Location).schools.forEach((s) =>
      suggestions.push({ key: s._id, title: s.displayName, icon: SCHOOL_ICON, type }),
    );
    (item as Location).departments.forEach((d) =>
      suggestions.push({ key: d._id, title: d.displayName, icon: DEPARTMENT_ICON, type }),
    );
    return suggestions;
  }
};
