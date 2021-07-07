import { useLinkTo } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, List, Button, Divider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { CollapsibleView, FullscreenIllustration, PageContainer } from '@components';
import { fetchNotifications } from '@redux/actions/data/account';
import getStyles from '@styles/global';
import { AccountRequestState, Notifications, State } from '@ts/types';
import { handleAction } from '@utils';

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
      actions: { name: string; action: { type: string; data: string }; important: boolean }[];
    };
  };
  expanded: boolean;
  onPress: () => any;
};

const Notification: React.FC<NotificationProps> = ({ notification, expanded, onPress }) => {
  const linkTo = useLinkTo();
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View>
      <List.Item
        left={() => (
          <View style={{ width: 50, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={notification.content.icon} color={notification.content.color} size={28} />
          </View>
        )}
        title={notification.content.title}
        description={notification.content.description}
        titleNumberOfLines={expanded ? 1e4 : 2}
        descriptionNumberOfLines={expanded ? 1e4 : 3}
        onPress={onPress}
      />
      <CollapsibleView collapsed={!expanded}>
        {expanded && (
          <View style={[styles.container, { flex: 1, flexDirection: 'row' }]}>
            {notification.content.actions?.map((a) => (
              <Button
                mode={a.important ? 'contained' : 'text'}
                onPress={() => handleAction(a.action.type, a.action.data, linkTo)}
              >
                {a.name}
              </Button>
            ))}
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
        data={notifications.sort((a, b) => (a.date > b.date ? -1 : 1))}
        keyExtractor={(notification) => notification._id}
        ListEmptyComponent={
          state.notifications.loading || !state.notifications.success ? null : (
            <FullscreenIllustration illustration="auth-register">
              Aucune notification
            </FullscreenIllustration>
          )
        }
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
