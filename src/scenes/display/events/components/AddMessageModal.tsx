import React from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import { Divider, Menu, Provider } from 'react-native-paper';
import { connect } from 'react-redux';

import { CategoriesList, PlatformIconButton, Modal, ErrorMessage } from '@components/index';
import { ModalProps, State, Account, EventRequestState, Content } from '@ts/types';
import { useTheme, logger } from '@utils/index';

import getEventStyles from '../styles/Styles';

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
  const eventStyles = getEventStyles(theme);
  const { colors } = theme;

  const [messageText, setMessageText] = React.useState('');
  const [type, setType] = React.useState<'high' | 'medium' | 'low'>('medium');
  // const [menuVisible, setMenuVisible] = React.useState(false);

  const publishers: MessagePublisher[] = [];
  account.groups
    ?.filter((g) =>
      account.permissions.some(
        (p) =>
          p.group === g._id &&
          p.permission === 'event.messages.add' &&
          (p.scope.everywhere || p.scope.groups.includes(id)),
      ),
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
      : publishers
      ? publishers[0].key
      : null,
  );

  const incrementType = () => {
    const types = ['high', 'medium', 'low', 'high'];
    const newType = types[types.indexOf(type) + 1];
    setType(newType);
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
              what: 'l&apos;ajout du message',
              contentSingular: 'Le message',
            }}
            error={state.messages_add?.error}
            retry={submitMessage}
          />
        )}
        <View style={eventStyles.activeCommentContainer}>
          <TextInput
            autoFocus
            placeholder="Écrire un message..."
            placeholderTextColor={colors.disabled}
            style={eventStyles.commentInput}
            multiline
            value={messageText}
            onChangeText={setMessageText}
          />
        </View>
        <Divider style={eventStyles.divider} />
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
