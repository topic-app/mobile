import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput } from 'react-native';
import { TextInput, Button, IconButton, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { StepperViewPageProps, InlineCard, FormTextInput } from '@components/index';
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
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const phoneInput = createRef<RNTextInput>();
  const emailInput = createRef<RNTextInput>();

  type CustomContactType = {
    _id: string;
    key: string;
    value: string;
    link: string;
  };

  const addEventOrganizer = (user: UserPreload) => {
    const previousEventIds = eventOrganizers.map((p) => p._id);
    if (!previousEventIds.includes(user._id)) {
      setEventOrganizers([...eventOrganizers, user]);
    }
  };

  const addCustomContact = (contact: any) => {
    setCustomContact([...customContact, contact]);
  };

  if (!account.loggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.centerIllustrationContainer}>
          <Text>Non autorisé</Text>
        </View>
      </View>
    );
  }

  const ContactSchema = Yup.object().shape({
    phone: Yup.string().matches(
      /^\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)?\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$$/,
      'Numéro de téléphone invalide',
    ),
    email: Yup.string().email('Adresse email invalide').max(120, 'Adresse email trop longue'),
  });

  return (
    <View style={eventStyles.formContainer}>
      <View style={styles.container}>
        <Text>
          Les moyens de contact ci-dessous seront visibles publiquement. Vérifiez que vous avez bien
          l&apos;accord de la personne concernée avant de publier ses informations de contact.
        </Text>
      </View>
      <Formik
        initialValues={{ phone: '', email: '' }}
        onSubmit={({ phone, email }) => {
          updateEventCreationData({
            phone,
            email,
            contact: customContact,
            members: eventOrganizers.map((u) => u._id),
          });
          next();
        }}
        validationSchema={ContactSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <View>
            <FormTextInput
              ref={phoneInput}
              label="Numéro de téléphone (facultatif)"
              value={values.phone}
              touched={touched.phone}
              error={errors.phone}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              onSubmitEditing={() => emailInput.current!.focus()}
              style={eventStyles.textInput}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoCompleteType="tel"
              autoFocus
            />
            <FormTextInput
              ref={emailInput}
              label="Adresse mail (facultatif)"
              value={values.email}
              touched={touched.email}
              error={errors.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              onSubmitEditing={() => handleSubmit()}
              style={eventStyles.textInput}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCompleteType="email"
            />

            <View style={{ marginTop: 30 }}>
              <List.Subheader>Autres moyens de contact (réseaux sociaux, etc.)</List.Subheader>
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
                onPress={() => handleSubmit()}
                style={{ flex: 1, marginLeft: 5 }}
              >
                Suivant
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventAddPageContact);
