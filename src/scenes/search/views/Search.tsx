import React, { useState } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { Text, Searchbar, Button, useTheme, Divider } from 'react-native-paper';
import { useFocusEffect, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Illustration from '@components/Illustration';

import {
  CategoriesList,
  ChipAddList,
  ChipSuggestionList,
  CategoryTitle,
  CollapsibleView,
} from '@components/index';
import getStyles from '@styles/Styles';

import getSearchStyles from '../styles/Styles';
import { getSuggestions, SuggestionType } from '../utils/suggestions';
import type { SearchStackParams } from '../index';

const categories = [
  { key: 'articles', title: 'Articles', icon: 'newspaper', type: 'category' },
  { key: 'events', title: 'Évènements', icon: 'calendar', type: 'category' },
  { key: 'petitions', title: 'Pétitions', icon: 'comment-check-outline', type: 'category' },
  { key: 'locations', title: 'Lieux', icon: 'map-marker-outline', type: 'category' },
  { key: 'groups', title: 'Groupes', icon: 'account-group-outline', type: 'category' },
  { key: 'users', title: 'Utilisateurs', icon: 'account-outline', type: 'category' },
];

type SearchProps = {
  navigation: StackNavigationProp<SearchStackParams, 'Search'>;
  route: RouteProp<SearchStackParams, 'Search'>;
};

const Search: React.FC<SearchProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const searchStyles = getSearchStyles(theme);

  const insets = useSafeArea();

  const { initialCategory } = route.params;

  // State related to query, use these values when submitting search
  const [searchText, setSearchText] = useState('');

  type FiltersType = {
    category: typeof initialCategory;
    tags: string[];
    locations: string[];
    groups: string[];
  };
  const [filters, setFilters] = useState<FiltersType>({
    category: initialCategory,
    tags: [], // Array of tag ids
    locations: [], // Array of location ids
    groups: [], // Array of group ids
  });

  // State related to layout
  const [filterCollapsed, setFilterCollapsed] = useState(false);

  // At every re-render, newSuggestions (see below) is subject to change, but we don't want to lose suggestions
  // that we've tapped on, so we store all suggestions we've tapped on so we don't lose them on rerender
  type SuggestionDataType = {
    tags: SuggestionType[];
    locations: SuggestionType[];
    groups: SuggestionType[];
  };
  const [suggestionData, setSuggestionData] = useState<SuggestionDataType>({
    tags: [],
    locations: [],
    groups: [],
  });

  // Fetch new suggestions relevant to the user's search query, every time the user changes the Searchbar input,
  // this componenent gets rerendered and new suggestions are requested
  const { newTags, newLocations, newGroups } = getSuggestions(searchText, filters);

  // Transform array of [{_id: '32133423', displayName: 'informatique'}, ...] into an array readable by ChipAddList
  // => [{ key: '32133423', title: 'informatique', icon: TAG_ICON, type: 'tags'}, ...]
  // When we expand filters, we want to see primarily the tags we've added but also suggestions at the end of ChipAddList
  // But in some cases, newTags might contain items which are already in suggestionData, resulting in duplicate items
  // So we make sure that incoming suggestions are not duplicates of old ones before displaying them in ChipAddList
  const remainingTags = newTags.filter(
    (tag) => !suggestionData.tags.map((s) => s.key).includes(tag.key),
  );
  // This is only for the ChipList that shows when filters are collapsed, it doesn't care about old tags at all and only
  // shows most relevant tags. If the tag's _id is added to filters.tags, then it dissapears from the ChipList
  const nonAddedTags = newTags.filter((tag) => !filters.tags.includes(tag.key));
  // Merge old and new tags to show in expanded filters
  const tagData = [...suggestionData.tags, ...remainingTags];

  // Same principle as tags
  const remainingLocations = newLocations.filter(
    (loc) => !suggestionData.locations.map((s) => s.key).includes(loc.key),
  );
  const nonAddedLocations = newLocations.filter((loc) => !filters.locations.includes(loc.key));
  const locationData = [...suggestionData.locations, ...remainingLocations];

  // Same principle as tags and locations
  const remainingGroups = newGroups.filter(
    (grp) => !suggestionData.groups.map((s) => s.key).includes(grp.key),
  );
  const nonAddedGroups = newGroups.filter((grp) => !filters.groups.includes(grp.key));
  const groupData = [...suggestionData.groups, ...remainingGroups];

  // Helper functions
  const collapseFilter = () => setFilterCollapsed(true);
  const expandFilter = () => setFilterCollapsed(false);

  const numFilters = filters.locations.length + filters.tags.length + filters.groups.length;
  const categoryName = categories.find((c) => c.key === filters.category)!.title;

  // Takes a given suggestion and adds it to filters
  const addSuggestion = (suggestion: SuggestionType) => {
    const { type, key } = suggestion;
    // Will only proceed with adding it to filters if it isn't already added
    if (!filters[type].includes(key)) {
      // Check if the suggestion is added or not to suggestionData
      const suggestionKeys = suggestionData[type].map((s) => s.key);
      // If the suggestion is not found in suggestionData, add it
      if (!suggestionKeys.includes(key)) {
        setSuggestionData({
          ...suggestionData,
          [type]: [...suggestionData[type], suggestion],
        });
      }
      // Add it to filters list
      setFilters({ ...filters, [type]: [...filters[type], suggestion.key] });
    }
  };

  const toggleSuggestion = (suggestion: SuggestionType) => {
    // Same thing as addSuggestion but this one toggles the suggestion
    const { type, key } = suggestion;
    if (!filters[type].includes(key)) {
      const suggestionKeys = suggestionData[type].map((s) => s.key);
      if (!suggestionKeys.includes(key)) {
        setSuggestionData({
          ...suggestionData,
          [type]: [...suggestionData[type], suggestion],
        });
      }
      setFilters({ ...filters, [type]: [...filters[type], suggestion.key] });
    } else {
      // If the suggestion is found in filters, remove it from filters
      // Note that the suggestion is not removed from suggestionData, so it persists in tagData even when
      // new suggestions are cycled, so the user can add it again without having to search for it again
      setFilters({ ...filters, [type]: filters[type].filter((item) => item !== key) });
    }
  };

  const submitSearch = () => {
    collapseFilter();
    console.log(`Search: \nText: ${searchText} \nFilters: ${JSON.stringify(filters)}`);
  };

  const searchRef = React.createRef<TextInput>();

  useFocusEffect(
    React.useCallback(() => {
      setImmediate(() => searchRef.current?.focus());
    }, [null]),
  );

  return (
    <View style={styles.page}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={searchStyles.queryContainer}>
          <View style={{ height: insets.top, width: '100%' }} />
          <Searchbar
            ref={searchRef}
            icon="arrow-left"
            onIconPress={navigation.goBack}
            placeholder="Rechercher"
            onChangeText={(props) => {
              setSearchText(props);
              collapseFilter();
            }}
            value={searchText}
            style={searchStyles.searchbar}
            onSubmitEditing={submitSearch}
          />
          <CollapsibleView collapsed={!filterCollapsed}>
            <View style={searchStyles.containerBottom}>
              <View style={searchStyles.container}>
                <View style={{ flexDirection: 'row' }}>
                  <CategoryTitle containerStyle={{ flex: 1 }} numberOfLines={1}>
                    {categoryName}
                    {` · ${numFilters} ${numFilters === 1 ? 'filtre actif' : 'filtres actifs'}`}
                  </CategoryTitle>
                  <Button
                    compact
                    color={colors.subtext}
                    mode="outlined"
                    icon="filter-variant"
                    onPress={expandFilter}
                  >
                    Filtres
                  </Button>
                </View>
              </View>
              <CollapsibleView
                collapsed={
                  nonAddedTags.length === 0 &&
                  nonAddedLocations.length === 0 &&
                  nonAddedGroups.length === 0
                }
              >
                <Divider style={{ marginTop: 10, marginBottom: 5 }} />
                <View style={searchStyles.suggestionContainer}>
                  <CategoryTitle icon="tag-multiple" containerStyle={{ flex: 1, paddingTop: 0 }}>
                    Suggestions
                  </CategoryTitle>
                </View>
                <ChipSuggestionList
                  data={[...nonAddedTags, ...nonAddedLocations, ...nonAddedGroups]}
                  containerStyle={{ paddingVertical: 0 }}
                  setList={addSuggestion}
                />
              </CollapsibleView>
            </View>
          </CollapsibleView>
          <CollapsibleView collapsed={filterCollapsed}>
            <View>
              <CategoryTitle icon="shape" containerStyle={searchStyles.container}>
                Categorie
              </CategoryTitle>
              <CategoriesList
                categories={categories}
                selected={filters.category}
                setSelected={(category: any) => setFilters({ ...filters, category })}
              />
            </View>
            <CollapsibleView collapsed={locationData.length === 0}>
              <CategoryTitle icon="map-marker" containerStyle={searchStyles.container}>
                Localisation
              </CategoryTitle>
              <ChipAddList
                data={locationData}
                keyList={filters.locations}
                setList={toggleSuggestion}
              />
            </CollapsibleView>
            <CollapsibleView collapsed={tagData.length === 0}>
              <CategoryTitle icon="tag-multiple" containerStyle={searchStyles.container}>
                Tags
              </CategoryTitle>
              <ChipAddList data={tagData} keyList={filters.tags} setList={toggleSuggestion} />
            </CollapsibleView>
            <CollapsibleView collapsed={groupData.length === 0}>
              <CategoryTitle icon="account-multiple" containerStyle={searchStyles.container}>
                Groupes
              </CategoryTitle>
              <ChipAddList data={groupData} keyList={filters.groups} setList={toggleSuggestion} />
            </CollapsibleView>
            <View style={[searchStyles.container, searchStyles.containerBottom]}>
              <Button
                onPress={collapseFilter}
                icon="filter-variant"
                mode="outlined"
                color={colors.subtext}
              >
                Cacher les filtres
              </Button>
            </View>
          </CollapsibleView>
        </View>
        <View>
          {searchText === '' ? (
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="search" height={200} width={200} />
              <Text>Commencez à taper pour rechercher !</Text>
            </View>
          ) : (
            <Text>Hello</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
