import { Formik } from 'formik';
import React from 'react';
import { View, Platform, TextInput as RNTextInput } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import shortid from 'shortid';
import * as Yup from 'yup';

import { FormTextInput, Modal, TabChipList } from '@components';
import { ModalProps, State } from '@ts/types';

import getStyles from '../styles';

type ContactAddModalProps = ModalProps & {
  add: (contact: CustomContactType) => void;
};

type CustomContactType = {
  _id: string;
  key: string;
  value: string;
  link?: string;
};

const ContactAddModal: React.FC<ContactAddModalProps> = ({ visible, setVisible, add }) => {
  const keyInput = React.createRef<RNTextInput>();
  const valueInput = React.createRef<RNTextInput>();
  const linkInput = React.createRef<RNTextInput>();

  const predefinedSocials = [
    {
      key: 'none',
      title: 'Personnalisé',
    },
    {
      key: 'instagram',
      title: 'Instagram',
      link: 'https://instagram.com/%s',
    },
    {
      key: 'twitter',
      title: 'Twitter',
      link: 'https://twitter.com/%s',
    },
    {
      key: 'facebook',
      title: 'Facebook',
      link: 'https://facebook.com/%s',
    },
    {
      key: 'subreddit',
      title: 'Subreddit',
      link: 'https://reddit.com/s/%s',
    },
  ];

  const [predefinedType, setPredefinedType] = React.useState<string | null>(null);

  const theme = useTheme();
  const styles = getStyles(theme);

  const ContactSchema = Yup.object().shape({
    key: predefinedType ? Yup.string() : Yup.string().required('Titre requis'),
    link: Yup.string().url('Lien invalide'),
    value: Yup.string().required('Valeur requise'),
  });

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <TabChipList
        sections={[{ key: 'main', data: predefinedSocials }]}
        selected={predefinedType || 'none'}
        setSelected={(val) => (val !== 'none' ? setPredefinedType(val) : setPredefinedType(null))}
      />
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ key: '', value: '', link: '' }}
          onSubmit={({ key, value, link }) => {
            if (predefinedType) {
              add({
                _id: shortid(),
                key: predefinedSocials.find((p) => p.key === predefinedType)?.key || 'Inconnu',
                value,
                link: predefinedSocials
                  .find((p) => p.key === predefinedType)
                  ?.link?.replace('%s', value),
              });
            } else {
              add({
                _id: shortid(),
                key,
                value,
                link,
              });
            }
            setVisible(false);
          }}
          validationSchema={ContactSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <View>
              {!predefinedType ? (
                <FormTextInput
                  ref={keyInput}
                  label="Titre"
                  value={values.key}
                  touched={touched.key}
                  error={errors.key}
                  onChangeText={handleChange('key')}
                  onBlur={handleBlur('key')}
                  onSubmitEditing={() => valueInput.current!.focus()}
                  style={styles.textInput}
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoFocus
                />
              ) : null}
              <FormTextInput
                ref={valueInput}
                label={predefinedType ? "Nom d'utilisateur" : 'Valeur'}
                value={values.value}
                touched={touched.value}
                error={errors.value}
                onChangeText={handleChange('value')}
                onBlur={handleBlur('value')}
                onSubmitEditing={() => {
                  if (predefinedType) {
                    handleSubmit();
                  } else {
                    linkInput.current?.focus();
                  }
                }}
                style={styles.textInput}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {!predefinedType && (
                <FormTextInput
                  ref={linkInput}
                  label="Lien (facultatif)"
                  value={values.link}
                  touched={touched.link}
                  error={errors.link}
                  onChangeText={handleChange('link')}
                  onBlur={handleBlur('link')}
                  onSubmitEditing={() => handleSubmit()}
                  style={styles.textInput}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              )}
              <View style={{ height: 10 }} />
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
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { eventData } = state;
  return {
    creationData: eventData.creationData,
  };
};

export default connect(mapStateToProps)(ContactAddModal);
