import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTestInput, FlatList } from 'react-native';
import { TextInput, Button, IconButton, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import { useTheme } from '@utils/index';
import { Account, State, EventCreationData, EventPlace, User } from '@ts/types';
import { StepperViewPageProps, InlineCard } from '@components/index';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import { Account, State, UserPreload } from '@ts/types';
import { useTheme } from '@utils/index';

import getAuthStyles from '../styles/Styles';
import ContactAddModal from './ContactAddModal';
import UserSelectModal from './UserSelectModal';

type Props = StepperViewPageProps & {
  account: Account;
};

const EventAddPageContact: React.FC<Props> = ({ next, prev, account }) => {
  const [isAddUserModalVisible, setAddUserModalVisible] = React.useState(false);
  const [isContactAddModalVisible, setContactAddModalVisible] = React.useState(false);
  const [eventOrganizers, setEventOrganizers] = React.useState<UserPreload[]>([]);
  const [customContact, setCustomContact] = React.useState<CustomContactType[]>([]);

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const phoneInput = createRef<RNTestInput>();
  const emailInput = createRef<RNTestInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  type CustomContactType = {
    _id: string;
    key: string;
    value: string;
    link: string;
  };

  let tempPhone: InputStateType;
  let tempEmail: InputStateType;

  const [currentPhone, setCurrentPhone] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  const [currentEmail, setCurrentEmail] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  const addEventOrganizer = (user: UserPreload) => {
    const previousEventIds = eventOrganizers.map((p) => p._id);
    if (!previousEventIds.includes(user._id)) {
      setEventOrganizers([...eventOrganizers, user]);
    }
  };

  const addCustomContact = (contact: any) => {
    setCustomContact([...customContact, contact]);
  };

  function setPhone(data: Partial<InputStateType>) {
    // Because async setState
    tempPhone = { ...currentPhone, ...(tempPhone ?? {}), ...data };
    setCurrentPhone(tempPhone);
  }

  function setEmail(data: Partial<InputStateType>) {
    // Because async setState
    tempEmail = { ...currentEmail, ...(tempEmail ?? {}), ...data };
    setCurrentEmail(tempEmail);
  }

  async function validatePhoneInput(content: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };
    if (content.length !== 0 && content.length !== 10) {
      validation = {
        valid: false,
        error: true,
        message: 'Entrez un numéro de téléphone valide',
      };
    } else {
      validation = { valid: true, error: false };
    }
    setPhone(validation);
    return validation;
  }

  function preValidatePhoneInput(content: string) {
    if (content.length !== 0 && content.length !== 10) {
      setPhone({ valid: false, error: false });
    }
  }

  function blurInputs() {
    phoneInput.current?.blur();
    emailInput.current?.blur();
  }

  async function submit() {
    blurInputs();
    const phoneVal = currentPhone.value;
    const emailVal = currentEmail.value;

    const phone = await validatePhoneInput(phoneVal);
    if (phone.valid) {
      updateEventCreationData({
        phone: phoneVal,
        email: emailVal,
        contact: customContact,
        members: eventOrganizers.map((u) => u._id),
      });
      next();
    } else {
      if (!phone.valid && !phone.error) {
        setPhone({
          valid: false,
          error: true,
          message: 'Entrez un numéro de téléphone valide',
        });
      }
    }
  }

  if (!account.loggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.centerIllustrationContainer}>
          <Text>Non autorisé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={eventStyles.formContainer}>
      <View style={styles.container}>
        <Text>
          Les moyens de contact ci-dessous seront visibles publiquement. Vérifiez que vous avez bien
          l&apos;accord de la personne concernée avant de publier ses informations de contact.
        </Text>
      </View>
      <View style={styles.container}>
        <TextInput
          ref={phoneInput}
          label="Numéro de téléphone (facultatif)"
          value={currentPhone.value}
          error={currentPhone.error}
          keyboardType="phone-pad"
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validatePhoneInput(nativeEvent.text);
            emailInput.current?.focus();
          }}
          autoFocus
          theme={
            currentPhone.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validatePhoneInput(nativeEvent.text);
          }}
          style={eventStyles.textInput}
          onChangeText={(text) => {
            setPhone({ value: text });
            preValidatePhoneInput(text);
          }}
        />
      </View>
      <View style={styles.container}>
        <TextInput
          ref={emailInput}
          label="Adresse mail (facultatif)"
          value={currentEmail.value}
          error={currentEmail.error}
          keyboardType="email-address"
          disableFullscreenUI
          theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
          mode="outlined"
          style={eventStyles.textInput}
          onChangeText={(text) => {
            setEmail({ value: text });
          }}
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <List.Subheader> Autres moyen de contact (réseaux sociaux etc)</List.Subheader>
        {customContact?.map((contact) => (
                    <View
                      key={contact._id}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ flexGrow: 1, width: 250, marginRight: 20 }}>
                      <InlineCard
                        key={contact._id}
                        icon="at"
                        title={contact.value}
                        subtitle={contact.key}
                      />
                      </View>
                      <View style={{ flexGrow: 1 }}>
                        <IconButton
                          icon="delete"
                          size={30}
                          style={{ marginRight: 20, flexGrow: 1 }}
                          onPress={() => {
                            setCustomContact(customContact.filter((s) => s !== contact));
                          }}
                        />
                      </View>
                    </View>
                  ))}
      </View>
      <View style={styles.container}>
        <Button
          mode="outlined"
          uppercase={Platform.OS !== 'ios'}
          onPress={() => {
            setContactAddModalVisible(true);
          }}
        >
          Ajouter
        </Button>
      </View>

      <View style={{ marginTop: 30 }}>
        <List.Subheader> Organisateurs </List.Subheader>
        {eventOrganizers?.map((user) => (
          <View
            key={user._id}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
           >
            <View style={{ flexGrow: 1, width: 250, marginRight: 20 }}>
              <InlineCard
                key={user._id}
                avatar={user.info.avatar}
                title={user.info.username}
              />
            </View>
              <View style={{ flexGrow: 1 }}>
                <IconButton
                  icon="delete"
                  size={30}
                  style={{ marginRight: 20, flexGrow: 1 }}
                  onPress={() => {
                    setEventOrganizers(eventOrganizers.filter((s) => s !== user));
                    }}
                />
              </View>
         </View>
        ))}
      </View>
      <View style={styles.container}>
        <Button
          mode="outlined"
          uppercase={Platform.OS !== 'ios'}
          onPress={() => {
            setAddUserModalVisible(true);
          }}
        >
          Ajouter
        </Button>
      </View>

      <UserSelectModal
        visible={isAddUserModalVisible}
        setVisible={setAddUserModalVisible}
        next={(user) => {
          addEventOrganizer(user);
        }}
      />
      <ContactAddModal
        visible={isContactAddModalVisible}
        setVisible={setContactAddModalVisible}
        add={(contact) => {
          addCustomContact(contact);
        }}
      />
      <View style={{ height: 20 }} />

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
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventAddPageContact);
