import { Formik } from 'formik';
import React from 'react';
import { View, Platform, TextInput } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import shortid from 'shortid';
import * as Yup from 'yup';

import { FormTextInput, Modal } from '@components';
import { ModalProps, EventCreationDataPlace } from '@ts/types';

import getStyles from '../styles';

type PlaceAddressModalProps = ModalProps & {
  add: (place: EventCreationDataPlace) => void;
};

const PlaceAddressModal: React.FC<PlaceAddressModalProps> = ({ visible, setVisible, add }) => {
  const numberInput = React.createRef<TextInput>();
  const streetInput = React.createRef<TextInput>();
  const extraInput = React.createRef<TextInput>();
  const codeInput = React.createRef<TextInput>();
  const cityInput = React.createRef<TextInput>();

  function blurInputs() {
    numberInput.current?.blur();
    streetInput.current?.blur();
    extraInput.current?.blur();
    codeInput.current?.blur();
    cityInput.current?.blur();
  }

  const theme = useTheme();
  const styles = getStyles(theme);

  const AddressSchema = Yup.object().shape({
    number: Yup.string().max(10, 'Le numéro de rue doit comporter moins de 10 caractères'),
    // If user enters something in number, make street required
    street: Yup.string()
      .when('number', {
        is: (number: string) => number !== '',
        then: Yup.string().required(
          'Il faut préciser le nom de rue si vous entrer un numéro de rue',
        ),
        otherwise: Yup.string(),
      })
      .max(100, 'Le nom de rue doit comporter moins de 100 caractères'),
    extra: Yup.string().max(100, 'Ce champ dois être moins de 100 caractères'),
    code: Yup.string().max(15, 'Code postal doit être moins de 15 caractères'),
    city: Yup.string()
      .when('code', {
        is: (code: string) => code !== '',
        then: Yup.string().required('Entrer le nom de la ville'),
        otherwise: Yup.string(),
      })
      .max(150, 'Le nom de la ville doit comporter moins de 150 caractères'),
  });

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ number: '', street: '', city: '', code: '', extra: '' }}
          onSubmit={({ number, street, city, code, extra }) => {
            add({
              id: shortid(),
              type: 'standalone',
              // We cannot possibly add coordinates client-side
              // This will surely result in the server skipping
              // generation of coordinates from address, which we
              // absolutely do not want

              // @ts-expect-error
              address: {
                _id: shortid(),
                shortName: undefined,
                // geo: {
                //   type: 'Point',
                //   coordinates: [0, 0],
                // },
                address: { number, street, extra, city, code },
                departments: [],
              },
            });
            setVisible(false);
          }}
          validationSchema={AddressSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <View>
              <FormTextInput
                ref={numberInput}
                label="Numéro de rue"
                value={values.number}
                touched={touched.number}
                error={errors.number}
                onChangeText={handleChange('number')}
                onBlur={handleBlur('number')}
                onSubmitEditing={() => streetInput.current!.focus()}
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                autoFocus
              />
              <FormTextInput
                ref={streetInput}
                label="Nom de Rue"
                value={values.street}
                touched={touched.street}
                error={errors.street}
                onChangeText={handleChange('street')}
                onBlur={handleBlur('street')}
                onSubmitEditing={() => extraInput.current!.focus()}
                style={styles.textInput}
              />
              <FormTextInput
                ref={extraInput}
                label="Autre"
                value={values.extra}
                touched={touched.extra}
                error={errors.extra}
                onChangeText={handleChange('extra')}
                onBlur={handleBlur('extra')}
                onSubmitEditing={() => codeInput.current!.focus()}
                style={styles.textInput}
              />
              <FormTextInput
                ref={codeInput}
                label="Code Postal"
                value={values.code}
                touched={touched.code}
                error={errors.code}
                onChangeText={handleChange('code')}
                onBlur={handleBlur('code')}
                onSubmitEditing={() => cityInput.current!.focus()}
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="number-pad"
                textContentType="postalCode"
              />
              <FormTextInput
                ref={cityInput}
                label="Ville"
                value={values.city}
                touched={touched.city}
                error={errors.city}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                onSubmitEditing={() => handleSubmit()}
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="addressCity"
              />
              <View style={styles.buttonContainer}>
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

export default PlaceAddressModal;
