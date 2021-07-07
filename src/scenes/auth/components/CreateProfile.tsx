import { Formik } from 'formik';
import randomColor from 'randomcolor';
import React from 'react';
import { View, Platform, FlatList, TextInput as RNTextInput } from 'react-native';
import { Button, Card, Divider, Subheading, Title, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import shortid from 'shortid';
import * as Yup from 'yup';

import { Avatar, CollapsibleView, FormTextInput, StepperViewPageProps } from '@components';
import { updateCreationData } from '@redux/actions/data/account';
import { Avatar as AvatarType, State, LocationList } from '@ts/types';
import { trackEvent } from '@utils';

import getStyles from '../styles';

type Props = StepperViewPageProps & {
  username: string;
  accountType: 'public' | 'private';
  location: LocationList;
  landing: () => any;
};

const AuthCreatePageProfile: React.FC<Props> = ({
  next,
  prev,
  username = '',
  accountType = 'private',
  location,
  landing,
}) => {
  const firstnameInput = React.createRef<RNTextInput>();
  const lastnameInput = React.createRef<RNTextInput>();
  const flatlistRef = React.createRef<FlatList>();

  const generateAvatars = () =>
    ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].map((i) => {
      return {
        key: shortid(),
        type: 'gradient',
        gradient: {
          start: randomColor({ hue: i }),
          end: randomColor(),
          angle: Math.floor(Math.random() * 90 + 1),
        },
      };
    });

  const [avatars, setAvatars] = React.useState(generateAvatars());

  const addAvatars = () => setAvatars([...avatars, ...generateAvatars()]);

  const [activeAvatar, setActiveAvatar] = React.useState<AvatarType & { key?: string }>({
    type: 'gradient',
    gradient: avatars[0].gradient,
    text: username?.substring(0, 1) || '',
  });

  const [avatarsVisible, setAvatarsVisible] = React.useState(false);

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const ProfileSchema = Yup.object().shape({
    firstname: Yup.string().max(100, 'Le nom doit contenir moins de 100 caractères'),
    lastname: Yup.string().max(100, 'Le nom doit contenir moins de 100 caractères'),
  });

  return (
    <View>
      <View>
        <View style={styles.centerAvatarContainer}>
          {activeAvatar.type === 'gradient' && (
            <Avatar
              size={100}
              onPress={() => setAvatarsVisible(!avatarsVisible)}
              avatar={{
                type: 'gradient',
                gradient: {
                  start: activeAvatar.gradient.start,
                  end: activeAvatar.gradient.end,
                  angle: activeAvatar.gradient.angle,
                },
                text: username?.substring(0, 1) || '',
              }}
            />
          )}
        </View>
        <CollapsibleView collapsed={!avatarsVisible}>
          <Divider />
          <FlatList
            ref={flatlistRef}
            data={avatars}
            horizontal
            onEndReachedThreshold={0.5}
            onEndReached={addAvatars}
            renderItem={({ item }) => {
              return (
                <View
                  style={[
                    styles.avatarContainer,
                    item.key === activeAvatar.key
                      ? { backgroundColor: colors.primary }
                      : { borderRadius: 55 },
                  ]}
                >
                  <Avatar
                    size={100}
                    onPress={() =>
                      setActiveAvatar({
                        type: 'gradient',
                        gradient: item.gradient,
                        text: username?.substring(0, 1) || '',
                      })
                    }
                    avatar={{
                      type: 'gradient',
                      gradient: item.gradient,
                      text: username?.substring(0, 1) || '',
                    }}
                  />
                </View>
              );
            }}
          />
          <Divider />
        </CollapsibleView>
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ firstname: '', lastname: '' }}
          validationSchema={ProfileSchema}
          onSubmit={({ firstname, lastname }) => {
            delete activeAvatar.key;

            updateCreationData({
              firstName: firstname,
              lastName: lastname,
              avatar: activeAvatar,
              schools: location.schools,
              departments: location.departments,
              global: location.selected ? location.global : true,
            });
            trackEvent('auth:create-page-legal');
            next();
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              {accountType === 'public' && (
                <View>
                  <FormTextInput
                    ref={firstnameInput}
                    label="Prénom (facultatif)"
                    value={values.firstname}
                    touched={touched.firstname}
                    error={errors.firstname}
                    onChangeText={handleChange('firstname')}
                    onBlur={handleBlur('firstname')}
                    onSubmitEditing={() => lastnameInput.current?.focus()}
                    style={styles.textInput}
                    textContentType="givenName"
                    autoCompleteType="name"
                    autoCorrect={false}
                    autoFocus
                  />
                  <FormTextInput
                    ref={lastnameInput}
                    label="Nom (falcultatif)"
                    value={values.lastname}
                    touched={touched.lastname}
                    error={errors.lastname}
                    onChangeText={handleChange('lastname')}
                    onBlur={handleBlur('lastname')}
                    onSubmitEditing={() => handleSubmit()}
                    style={styles.textInput}
                    textContentType="givenName"
                    autoCompleteType="name"
                    autoCorrect={false}
                  />
                </View>
              )}
              {location.selected ? (
                <View>
                  <View style={{ marginBottom: 10, marginTop: 20 }}>
                    <Subheading>Localisation</Subheading>
                  </View>
                  {location.schoolData.map((s) => (
                    <Card key={s._id} style={{ marginBottom: 10 }}>
                      <Card.Content>
                        <Title>{s?.name}</Title>
                        <Subheading>
                          {s?.address?.shortName || s?.address?.address?.city}
                        </Subheading>
                      </Card.Content>
                    </Card>
                  ))}
                  {location.departmentData.map((d) => (
                    <Card key={d._id} style={{ marginBottom: 10 }}>
                      <Card.Content>
                        <Title>{d?.name}</Title>
                        <Subheading>{d?.type === 'region' ? 'Région' : 'Département'}</Subheading>
                      </Card.Content>
                    </Card>
                  ))}
                  {location.global && (
                    <Card style={{ marginBottom: 10 }}>
                      <Card.Content>
                        <Title>France entière</Title>
                        <Subheading>Pas d&apos;école ou département spécifique</Subheading>
                      </Card.Content>
                    </Card>
                  )}
                  <View style={{ marginBottom: 40 }}>
                    <Button mode="text" onPress={landing}>
                      Changer
                    </Button>
                  </View>
                </View>
              ) : (
                <View style={{ marginBottom: 60, alignItems: 'center' }}>
                  <Button mode="contained" onPress={landing} style={{ flex: 1 }}>
                    Choisir une localisation
                  </Button>
                </View>
              )}
              <View style={styles.buttonContainer}>
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
                  onPress={handleSubmit}
                  style={{ flex: 1, marginLeft: 5 }}
                >
                  Suivant
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { location } = state;
  return { location };
};

export default connect(mapStateToProps)(AuthCreatePageProfile);
