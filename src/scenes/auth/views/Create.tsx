import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, ScrollView } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  TranslucentStatusBar,
  StepperView,
  ErrorMessage,
  Illustration,
  PlatformBackButton,
} from '@components/index';
import { register } from '@redux/actions/data/account';
import getStyles from '@styles/Styles';

import getAuthStyles from '../styles/Styles';
import AuthCreatePageGeneral from '../components/CreateGeneral';
import AuthCreatePageSchool from '../components/CreateSchool';
import AuthCreatePagePrivacy from '../components/CreatePrivacy';
import AuthCreatePageProfile from '../components/CreateProfile';
import AuthCreatePageLegal from '../components/CreateLegal';

function AuthCreate({ navigation, reqState, creationData }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const authStyles = getAuthStyles(theme);
  const { colors } = theme;

  const create = () => {
    const reqParams = {
      accountInfo: {
        username: creationData.username,
        email: creationData.email,
        password: creationData.password,
        global: creationData.global,
        schools: creationData.schools,
        departments: creationData.departments,
        avatar: creationData.avatar,
        description: null,
        public: creationData.accountType === 'public',
        firstName: creationData.accountType === 'public' ? creationData.firstname : null,
        lastName: creationData.accountType === 'public' ? creationData.lastname : null,
      },
      device: {
        type: 'app',
        deviceId: null,
        canNotify: true,
      },
    };

    register(reqParams)
      .then(() =>
        navigation.navigate('Auth', {
          screen: 'CreateSuccess',
        }),
      )
      .catch((e) => console.log(e));
  };

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        {reqState.register.loading || reqState.check.loading ? (
          <ProgressBar indeterminate />
        ) : (
          <View style={{ height: 4 }} />
        )}
        {reqState.register.success === false && (
          <ErrorMessage
            error={reqState.register.error}
            strings={{
              what: 'la création du compte',
              contentSingular: 'Le compte',
            }}
            type="axios"
            retry={create}
          />
        )}
        {reqState.check.success === false && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la vérification des informations',
              contentPlural: 'des informations',
            }}
            error={reqState.check.error}
          />
        )}

        <ScrollView>
          <PlatformBackButton onPress={navigation.goBack} />
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="auth-register" height={200} width={200} />
            <Text style={authStyles.title}>Créer un compte</Text>
          </View>
          <StepperView
            pages={[
              {
                key: 'general',
                icon: 'account',
                title: 'General',
                component: <AuthCreatePageGeneral />,
              },
              {
                key: 'location',
                icon: 'school',
                title: 'École',
                component: <AuthCreatePageSchool />,
              },
              {
                key: 'privacy',
                icon: 'shield',
                title: 'Vie privée',
                component: <AuthCreatePagePrivacy />,
              },
              {
                key: 'profile',
                icon: 'comment-account',
                title: 'Profil',
                component: (
                  <AuthCreatePageProfile
                    username={creationData.username}
                    accountType={creationData.accountType}
                  />
                ),
              },
              {
                key: 'legal',
                icon: 'script-text',
                title: 'Conditions',
                component: <AuthCreatePageLegal userEmail={creationData.email} create={create} />,
              },
            ]}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { account } = state;
  return { creationData: account.creationData, reqState: account.state };
};

export default connect(mapStateToProps)(AuthCreate);

AuthCreate.defaultProps = {
  creationData: {},
  reqState: {
    error: null,
    success: null,
    loading: false,
  },
};

AuthCreate.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  creationData: PropTypes.shape({
    avatar: PropTypes.object,
    username: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    global: PropTypes.bool,
    schools: PropTypes.arrayOf(PropTypes.string),
    departments: PropTypes.arrayOf(PropTypes.string),
    accountType: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
  }),
  reqState: PropTypes.shape({
    register: PropTypes.shape({
      error: PropTypes.any,
      success: PropTypes.bool,
      loading: PropTypes.bool,
    }).isRequired,
    check: PropTypes.shape({
      error: PropTypes.any,
      success: PropTypes.bool,
      loading: PropTypes.bool,
    }).isRequired,
  }),
};
