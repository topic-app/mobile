import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, List, Button, Divider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { CollapsibleView, PageContainer } from '@components';
import { fetchNotifications } from '@redux/actions/data/account';
import getStyles from '@styles/global';
import { AccountRequestState, Notifications, State } from '@ts/types';

type NotificationProps = {
  notification: {
    _id: string;
    date: Date;
    priority: string;
    content: {
      title: string;
      description: string;
      icon: string;
      color: string;
      actions: { name: string; action: string; important: boolean }[];
    };
  };
  expanded: boolean;
  onPress: () => any;
};

const Notification: React.FC<NotificationProps> = ({ notification, expanded, onPress }) => {
  return (
    <View>
      <List.Item
        left={() => (
          <Icon name={notification.content.icon} color={notification.content.color} size={50} />
        )}
        title={notification.content.title}
        description={notification.content.description}
        titleNumberOfLines={expanded ? 1e4 : 2}
        descriptionNumberOfLines={expanded ? 1e4 : 3}
        onPress={onPress}
        descriptionStyle={{ textAlign: 'justify', marginRight: 50 }}
        titleStyle={{ textAlign: 'justify', marginRight: 50 }}
      />
      <CollapsibleView collapsed={!expanded}>
        {expanded && (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <FlatList
              horizontal
              style={{ marginHorizontal: 50, overflow: 'visible' }}
              data={notification.content.actions}
              keyExtractor={(action) => action.name}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Button
                  mode={item.important ? 'contained' : 'text'}
                  onPress={() => console.log(item.action)}
                >
                  {item.name}
                </Button>
              )}
            />
            {/* notification.content.actions.map(action => <Button mode={action.important ? 'contained' : 'text'} onPress={() => console.log(action.action)}>{action.name}</Button>) */}
          </View>
        )}
      </CollapsibleView>
      <Divider />
    </View>
  );
};

type NotificationsProps = {
  notifications: Notifications[];
  state: AccountRequestState;
};

const NotificationsDisplay: React.FC<NotificationsProps> = ({ notifications, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [selectedID, setSelectedID] = React.useState('');

  React.useEffect(() => {
    fetchNotifications();
  }, [null]);
  console.log(notifications);
  console.log(state.notifications);

  return (
    <PageContainer
      headerOptions={{ title: 'Notifications' }}
      loading={state.notifications.loading}
      showError={state.notifications.error}
      errorOptions={{
        type: 'axios',
        strings: {
          what: 'la mise à jour du profil',
          contentPlural: 'des informations de profil',
          contentSingular: 'Le profil',
        },
        error: state.notifications.error,
        retry: () => {
          fetchNotifications();
        },
      }}
      centered
    >
      <FlatList
        data={notifications}
        keyExtractor={(notification) => notification._id}
        renderItem={({ item }) => (
          <View>
            <Notification
              notification={item}
              onPress={() => setSelectedID(selectedID === item._id ? '' : item._id)}
              expanded={selectedID === item._id}
            />
          </View>
        )}
      />
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { notifications: account.notifications, state: account.state };
};

export default connect(mapStateToProps)(NotificationsDisplay);
