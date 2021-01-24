import { Formik } from 'formik';
import React from 'react';
import { View, Platform, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import shortid from 'shortid';
import * as Yup from 'yup';

import { FormTextInput, Modal } from '@components/index';
import { ModalProps, EventCreationDataPlace } from '@ts/types';
import { useTheme } from '@utils/index';

import getEventStyles from '../styles/Styles';

type PlaceOnlineModalProps = ModalProps & {
  add: (place: EventCreationDataPlace) => void;
};

const PlaceOnlineModal: React.FC<PlaceOnlineModalProps> = ({ visible, setVisible, add }) => {
  const linkInput = React.createRef<TextInput>();

  const theme = useTheme();
  const eventStyles = getEventStyles(theme);

  const OnlineSchema = Yup.object().shape({
    link: Yup.string()
      .required('Entrer un lien')
      .max(5000, 'Ce lien contient trop de caractères')
      .url('Entrer un lien valide'),
  });

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View style={eventStyles.formContainer}>
        <Formik
          initialValues={{ link: '' }}
          onSubmit={({ link }) => {
            add({
              id: shortid(),
              type: 'online',
              link: link as string,
            });
            setVisible(false);
          }}
          validationSchema={OnlineSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <View>
              <FormTextInput
                ref={linkInput}
                label="Lien"
                value={values.link}
                touched={touched.link}
                error={errors.link}
                onChangeText={handleChange('link')}
                onBlur={handleBlur('link')}
                style={eventStyles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                autoFocus
              />
              <View style={eventStyles.buttonContainer}>
                <Button
                  mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                  uppercase={Platform.OS !== 'ios'}
                  style={{ flex: 1, marginRight: 5 }}
                  onPress={() => {
                    linkInput.current?.blur();
                    setVisible(false);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                  uppercase={Platform.OS !== 'ios'}
                  onPress={handleSubmit}
                  style={{ flex: 1, marginLeft: 5 }}
                >
                  Ajouter
                </Button>
              </View>
            </View>
          )}
        </Formik>
        <View style={{ height: 20 }} />
      </View>
    </Modal>
  );
};

export default PlaceOnlineModal;
