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
import { updateUsers, searchUsers } from '@redux/actions/api/users';
import {
  StepperViewPageProps,
  ErrorMessage,
  ChipBase,
  TextChip,
  CollapsibleView,
  CategoryTitle,
  Avatar,
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
  User,
  UserRequestState,
  UserPreload,
} from '@ts/types';
import getStyles from '@styles/Styles';
import TagAddModal from './TagAddModal';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  account: Account;
  creationData: EventCreationData;
  navigation: any;
  usersData: UserPreload[];
  usersSearch: UserPreload[];
  state: UserRequestState;
};

type ReduxLocation = {
  schools: string[];
  departments: string[];
  global: boolean;
};

const EventAddPageContact: React.FC<Props> = ({
  prev,
  next,
  account,
  creationData,
  navigation,
  usersData,
  usersSearch,
  state,
}) => {
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  const submit = () => {
    updateEventCreationData({ users: selectedUsers });
    next();
  };

  const inputRef = React.useRef(null);

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);



  const searchChange = (text: string) => {
    if (text !== '') {
      searchUsers('initial', text);
    }
  };

  const renderItem = React.useCallback(
    ({ item = { name: 'INCONNU' } }) => {
      return (
        <View style={{ marginHorizontal: 5, alignItems: 'flex-start' }}>
          <TextChip
            title={item.name}
            containerStyle={{ borderColor: item.color }}
            onPress={() => {
              if (selectedUsers.includes(item._id)) {
                setSelectedUsers(selectedUsers.filter((s) => s !== item._id));
              } else {
                setSelectedUsers([...selectedUsers, item._id]);
                setSelectedData([...selectedData, item]);
              }
            }}
            icon={selectedUsers.includes(item._id) ? 'check' : 'pound'}
            selected={selectedUsers.includes(item._id)}
          />
        </View>
      );
    },
    [selectedUsers],
  );

  return (
    <View style={eventStyles.formContainer}>
      <View>
        <View>
          <View style={eventStyles.searchContainer}>
            <Searchbar
              ref={inputRef}
              placeholder="Rechercher"
              value={searchText}
              onChangeText={(props) => {
                setSearchText(props);
                searchChange(props);
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20, height: 100 }}>
      <FlatList
              data={(searchText === '' ? usersData : usersSearch).filter(
                (t) => !selectedUsers.includes(t._id),
              )}
              keyExtractor={(i) => i._id}
              style={{ maxHeight: 200 }}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <View style={{ minHeight: 50 }}>
                  {(searchText === '' && state.list.success) ||
                    (searchText !== '' && state.search.success && (
                      <View style={styles.centerIllustrationContainer}>
                        <Text>Aucun résultat</Text>
                      </View>
                    ))}
                </View>
              )}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name || item.info?.username}
                  left={() =>
                    item.avatar || item.info?.avatar ? (
                      <Avatar avatar={item.avatar || item.info?.avatar} size={50} />
                    ) : (
                      <List.Icon icon={icon} />
                    )
                  }
                  onPress={() => {
                    if (selectedUsers.includes(item._id)) {
                      setSelectedUsers(selectedUsers.filter((s) => s !== item._id));
                    } else {
                      setSelectedUsers([...selectedUsers, item._id]);
                      setSelectedData([...selectedData, item]);
                  }}}
                />
              )}
            />
      </View>
      <CollapsibleView collapsed={selectedUsers.length === 0} style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 15 }}>
          <CategoryTitle>Organisateurs sélectionnés</CategoryTitle>
        </View>
        <FlatList
          horizontal
          data={selectedUsers.map((t) => selectedData.find((u) => u?._id === t))}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => i?._id}
        />
      </CollapsibleView>
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
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, eventData, users } = state;
  return {
    account,
    creationData: eventData.creationData,
    usersData: users.data,
    usersSearch: users.search,
    state: users.state,
  };
};

export default connect(mapStateToProps)(EventAddPageContact);
