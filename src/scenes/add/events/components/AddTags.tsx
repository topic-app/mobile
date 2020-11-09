import React from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import {
  Button,
  RadioButton,
  HelperText,
  List,
  Text,
  Checkbox,
  useTheme,
  Divider,
  ProgressBar,
  Searchbar,
  Card,
  Chip,
} from 'react-native-paper';
import { connect } from 'react-redux';

import { updateEventCreationData } from '@redux/actions/contentData/events';
import { updateTags, searchTags } from '@redux/actions/api/tags';
import {
  StepperViewPageProps,
  ErrorMessage,
  ChipBase,
  TextChip,
  CollapsibleView,
  CategoryTitle,
} from '@components/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Account,
  State,
  EventCreationData,
  Location,
  Department,
  School,
  RequestState,
  Tag,
  TagRequestState,
  TagPreload,
} from '@ts/types';
import getStyles from '@styles/Styles';
import TagAddModal from './TagAddModal';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  account: Account;
  creationData: EventCreationData;
  navigation: any;
  tagsData: TagPreload[];
  tagsSearch: TagPreload[];
  state: TagRequestState;
};

type ReduxLocation = {
  schools: string[];
  departments: string[];
  global: boolean;
};

const EventAddPageTags: React.FC<Props> = ({
  prev,
  next,
  account,
  creationData,
  navigation,
  tagsData,
  tagsSearch,
  state,
}) => {
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  const [tagAddModalVisible, setTagAddModalVisible] = React.useState(false);
  const [tagName, setTagName] = React.useState(null);

  const submit = () => {
    updateEventCreationData({ tags: selectedTags });
    next();
  };

  const addNewTag = (tag: { _id: string; name: string; color: string }) => {
    console.log(JSON.stringify(tag));
    setSelectedTags([...selectedTags, tag._id]);
    setSelectedData([...selectedData, tag]);
  };

  const inputRef = React.useRef(null);

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const fetch = () => {
    if (searchText === '') {
      updateTags('initial');
    } else {
      searchTags('initial', searchText);
    }
  };

  const fetchNext = () => {
    if (searchText === '') {
      updateTags('next');
    } else {
      searchTags('next', searchText);
    }
  };

  const searchChange = (text: string) => {
    if (text !== '') {
      searchTags('initial', text);
    }
  };

  React.useEffect(() => {
    fetch();
  }, [null]);

  const ListEmptyComponent = () => {
    return (
      <View style={{ alignItems: 'flex-start' }}>
        {searchText !== '' &&
        state.search?.success &&
        !selectedData.some((t) => t.name?.toLowerCase() === searchText?.toLowerCase()) &&
        account.permissions?.some((p) => p.permission === 'tag.add') ? (
          <TextChip
            title={`Créer "${searchText.toLowerCase()}"`}
            icon="plus"
            onPress={() => {
              setTagName(searchText.toLowerCase());
              setTagAddModalVisible(true);
            }}
          />
        ) : (
          searchText !== '' &&
          state.search?.success && (
            <View
              style={[styles.centerIllustrationContainer, { height: 40, justifyContent: 'center' }]}
            >
              <Text>Aucun résultat</Text>
            </View>
          )
        )}
      </View>
    );
  };

  const ListHeaderComponent = () =>
    (searchText === '' && state.list.loading.initial) ||
    (searchText !== '' && state.search?.loading.initial) ? (
      <View style={{ marginVertical: 5, height: 40, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : null;

  const ListFooterComponent = () =>
    (searchText === '' && state.list.loading.next) ||
    (searchText !== '' && state.search?.loading.next) ? (
      <View style={{ marginVertical: 5, height: 40, width: 40, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : null;

  const renderItem = React.useCallback(
    ({ item = { name: 'INCONNU' } }) => {
      return (
        <View style={{ marginHorizontal: 5, alignItems: 'flex-start' }}>
          <TextChip
            title={item.name}
            containerStyle={{ borderColor: item.color }}
            onPress={() => {
              if (selectedTags.includes(item._id)) {
                setSelectedTags(selectedTags.filter((s) => s !== item._id));
              } else {
                setSelectedTags([...selectedTags, item._id]);
                setSelectedData([...selectedData, item]);
              }
            }}
            icon={selectedTags.includes(item._id) ? 'check' : 'pound'}
            selected={selectedTags.includes(item._id)}
          />
        </View>
      );
    },
    [selectedTags],
  );

  return (
    <View style={eventStyles.formContainer}>
      <View>
        <View>
          <View style={eventStyles.searchContainer}>
            <Searchbar
              ref={inputRef}
              placeholder={`Rechercher ${
                account.permissions?.some((p) => p.permission === 'tag.add') ? 'ou créer ' : ''
              }un tag`}
              value={searchText}
              onChangeText={(props) => {
                setSearchText(props);
                searchChange(props);
              }}
            />
          </View>
          {((searchText === '' && state.list.error) ||
            (searchText !== '' && state.search?.error)) && (
            <ErrorMessage
              type="axios"
              error={searchText === '' ? state.list.error : state.search?.error}
              retry={fetch}
            />
          )}
        </View>
      </View>
      <View style={{ marginTop: 20, height: 40 }}>
        <FlatList
          horizontal
          onEndReached={fetchNext}
          onEndReachedThreshold={0.1}
          data={(searchText === '' ? tagsData : tagsSearch).filter(
            (t) => !selectedTags.includes(t._id),
          )}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => i._id}
        />
      </View>
      <CollapsibleView collapsed={selectedTags.length === 0} style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 15 }}>
          <CategoryTitle>Tags sélectionnés</CategoryTitle>
        </View>
        <FlatList
          horizontal
          data={selectedTags.map((t) => selectedData.find((u) => u?._id === t))}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => i?._id}
        />
      </CollapsibleView>
      <View style={[styles.container, { marginTop: 40 }]}>
        <Card
          elevation={0}
          style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
        >
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <Icon
              name="tag-multiple"
              style={{ alignSelf: 'center', marginRight: 10 }}
              size={24}
              color={colors.primary}
            />
            <Text style={{ color: colors.text, flex: 1 }}>
              Les tags permettent aux utilisateurs de trouver plus facilement vos évènements et nous
              les utilisons pour pouvoir faire des recommendations aux utilisateurs.{'\n'}Tapez pour
              rechercher ou pour créer un nouveau tag si aucun ne correspond.
            </Text>
          </View>
        </Card>
      </View>
      <View style={{ marginTop: 30 }}>
        <Divider />
        <View style={eventStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => prev()}
            style={{ flex: 1, marginRight: 5 }}
          >
            Retour
          </Button>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={submit}
            style={{ flex: 1, marginLeft: 5 }}
          >
            Suivant
          </Button>
        </View>
      </View>

      <TagAddModal
        name={tagName}
        visible={tagAddModalVisible}
        setVisible={setTagAddModalVisible}
        add={addNewTag}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, eventData, tags } = state;
  return {
    account,
    creationData: eventData.creationData,
    tagsData: tags.data,
    tagsSearch: tags.search,
    state: tags.state,
  };
};

export default connect(mapStateToProps)(EventAddPageTags);
