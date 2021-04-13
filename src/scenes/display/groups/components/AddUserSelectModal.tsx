import { Formik } from 'formik';
import React from 'react';
import { View, Platform } from 'react-native';
import { Divider, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { Illustration, ErrorMessage, Modal, FormTextInput } from '@components/index';
import { fetchUserByUsername } from '@redux/actions/api/users';
import { updateState } from '@redux/actions/data/account';
import getStyles from '@styles/Styles';
import {
  State,
  ModalProps,
  GroupMember,
  UserPreload,
  UserRequestState,
  AccountRequestState,
  User,
} from '@ts/types';
import { logger, request, useTheme } from '@utils/index';

import getGroupStyles from '../styles/Styles';

type AddUserSelectModalProps = ModalProps & {
  state: UserRequestState;
  members: GroupMember[];
  next: (user: User) => any;
  reqState: AccountRequestState;
};

const AddUserSelectModal: React.FC<AddUserSelectModalProps> = ({
  visible,
  setVisible,
  state,
  members,
  next,
  reqState,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const groupStyles = getGroupStyles(theme);

  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
      .max(25, "Le nom d'utilisateur doit contenir moins de 26 caractères")
      .matches(
        /^[a-zA-Z0-9_.]+$/i,
        "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux sauf « _ » et « . ».",
      )
      .required("Nom d'utilisateur requis")
      .test('checkUsernameExists', "Ce nom d'utilisateur n'existe pas", async (username) => {
        if (!username) return true;

        let result;
        try {
          result = await request('auth/check/local/username', 'get', { username }, false, 'auth');
        } catch (err) {
          updateState({ check: { success: false, error: err, loading: false } });
        }
        return result?.data ? result?.data?.usernameExists : false;
      }),
  });

  const [error, setError] = React.useState<undefined | string>(undefined);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <Formik
          initialValues={{ username: '' }}
          validationSchema={RegisterSchema}
          validateOnChange={false}
          onSubmit={async ({ username }) => {
            const user = await fetchUserByUsername(username);
            if (members.some((m) => m.user._id === user?._id)) {
              setError('Cet utilisateur est déjà dans le groupe');
              return;
            }
            console.log('USER');
            console.log(user);
            if (user) {
              next(user);
              setVisible(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldError }) => (
            <View>
              {reqState.check.success === false && (
                <ErrorMessage
                  type="axios"
                  strings={{
                    what: "la vérification du nom d'utilisateur",
                    contentSingular: "le nom d'utilisateur",
                  }}
                  error={reqState.check.error}
                />
              )}
              {state.info.error && (
                <ErrorMessage
                  type="axios"
                  strings={{
                    what: "la récupération de l'utilisateur",
                    contentSingular: "l'utilisateur",
                  }}
                  error={state.info.error}
                />
              )}
              <View style={{ height: 160 }}>
                <View style={styles.centerIllustrationContainer}>
                  <Illustration name="user" height={200} width={200} />
                </View>
              </View>
              <Divider />

              <View style={styles.container}>
                <FormTextInput
                  label="Nom d'utilisateur"
                  value={values.username}
                  touched={touched.username}
                  error={errors.username || error}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  onSubmitEditing={() => handleSubmit()}
                  style={groupStyles.textInput}
                  textContentType="username"
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoFocus
                />
                <Button
                  mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                  uppercase={Platform.OS !== 'ios'}
                  onPress={() => handleSubmit()}
                  loading={state.info.loading}
                >
                  Suivant
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
  const { users, account } = state;
  return {
    users,
    state: users.state,
    account,
    reqState: account.state,
  };
};

export default connect(mapStateToProps)(AddUserSelectModal);
