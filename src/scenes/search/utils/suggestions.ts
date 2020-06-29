import { Location, TagPreload, GroupPreload } from '@ts/types';

type IdsType = { tags: string[]; locations: string[]; groups: string[] };

export function getSuggestions(queryText: string, ids: IdsType) {
  // Temporary tag getting, should hook up to server

  // Many possibilities to suggest tags; could suggest similar words based on lexical fields/synonyms
  const tags: TagPreload[] = [
    { _id: 'tag-informatique', displayName: 'informatique', color: '#00ff00' },
    { _id: 'tag-tech', displayName: 'tech', color: '#0000ff' },
    { _id: 'tag-windows', displayName: 'windows', color: '#ff0000' },
  ].filter((t) => !ids.tags.includes(t._id));

  const locations: Location = {
    _id: 'location',
    global: false,
    schools: [
      { _id: 'location-civ', displayName: 'CIV', types: ['lycee', 'college', 'prepa'] },
      { _id: 'location-sv', displayName: 'Simone Veil', types: ['lycee'] },
    ].filter((s) => !ids.locations.includes(s._id)),
    departments: [
      { _id: 'location-sud', displayName: 'Region Sud', type: 'region' },
      { _id: 'location-06', displayName: 'Alpes Maritimes', type: 'department' },
    ].filter((d) => !ids.locations.includes(d._id)),
  };

  const groups: GroupPreload[] = [
    { _id: 'group-aiglon', displayName: "L'Aiglon" },
    { _id: 'group-robotique', displayName: 'Club de Robotique' },
  ].filter((g) => !ids.groups.includes(g._id));

  return {
    newTags: mapSuggestions(tags, 'tags'),
    newLocations: mapSuggestions(locations, 'locations'),
    newGroups: mapSuggestions(groups, 'groups'),
  };
}

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
