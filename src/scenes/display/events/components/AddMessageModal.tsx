import React from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { CategoriesList, PlatformIconButton, Modal, ErrorMessage } from '@components';
import { ModalProps, State, Account, EventRequestState, Content } from '@ts/types';
import { logger, checkPermission, Permissions } from '@utils';

import getStyles from '../styles';

type MessagePublisher = {
  key: string;
  title: string;
  icon: string;
};

type AddMessageModalProps = ModalProps & {
  id: string;
  account: Account;
  defaultGroup: string;
  state: EventRequestState;
  add: (group: string, content: Content, type: 'high' | 'medium' | 'low') => any;
};

const AddMessageModal: React.FC<AddMessageModalProps> = ({
  visible,
  setVisible,
  account,
  defaultGroup,
  state,
  add,
  id,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [messageText, setMessageText] = React.useState('');
  const [type, setType] = React.useState<'high' | 'medium' | 'low'>('medium');
  // const [menuVisible, setMenuVisible] = React.useState(false);

  const publishers: MessagePublisher[] = [];
  account.groups
    ?.filter((g) =>
      checkPermission(account, {
        permission: Permissions.EVENT_MESSAGES_ADD,
        scope: { groups: [id] },
      }),
    )
    .forEach((g) =>
      publishers.push({
        key: g._id,
        title: g.shortName || g.name,
        icon: 'newspaper',
      }),
    );

  const [publisher, setPublisher] = React.useState(
    publishers.some((p) => p.key === defaultGroup)
      ? defaultGroup
      : publishers && publishers[0]
      ? publishers[0].key
      : '',
  );

  const incrementType = () => {
    if (type === 'medium') {
      setType('low');
    } else if (type === 'low') {
      setType('high');
    } else {
      setType('medium');
    }
  };

  const submitMessage = () => {
    if (account.loggedIn) {
      add(publisher, { parser: 'plaintext', data: messageText }, type)
        .then(() => {
          setMessageText('');
          setVisible(false);
        })
        .catch((e: any) => logger.warn('Failed to add message to event', e));
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        {state.messages_add?.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: "l'ajout du message",
              contentSingular: 'Le message',
            }}
            error={state.messages_add?.error}
            retry={submitMessage}
          />
        )}
        <View style={styles.activeCommentContainer}>
          <TextInput
            autoFocus
            placeholder="Écrire un message..."
            placeholderTextColor={colors.disabled}
            style={styles.commentInput}
            multiline
            value={messageText}
            onChangeText={setMessageText}
          />
        </View>
        <Divider style={styles.divider} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexGrow: 1 }}>
            <CategoriesList
              categories={publishers}
              selected={publisher}
              setSelected={setPublisher}
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
              marginLeft: 20,
            }}
          >
            <PlatformIconButton
              color={colors.text}
              icon={type === 'high' ? 'bell-ring' : type === 'medium' ? 'bell' : 'bell-off'}
              onPress={incrementType}
              style={{ padding: 0 }}
            />
            {state.messages_add?.loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginHorizontal: 7 }}
              />
            ) : (
              <PlatformIconButton
                color={messageText.length < 1 ? colors.disabled : colors.primary}
                icon="send"
                onPress={messageText.length < 1 ? undefined : submitMessage}
                style={{ padding: 0 }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return {
    account,
  };
};

export default connect(mapStateToProps)(AddMessageModal);
