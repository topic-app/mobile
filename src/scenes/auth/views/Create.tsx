import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  TranslucentStatusBar,
  StepperView,
  ErrorMessage,
  Illustration,
  PlatformBackButton,
  SafeAreaView,
} from '@components/index';
import { register } from '@redux/actions/data/account';
import getStyles from '@styles/Styles';
import { State, AccountRequestState, AccountCreationData } from '@ts/types';
import { logger, useTheme } from '@utils/index';

import AuthCreatePageGeneral from '../components/CreateGeneral';
import AuthCreatePageLegal from '../components/CreateLegal';
import AuthCreatePagePrivacy from '../components/CreatePrivacy';
import AuthCreatePageProfile from '../components/CreateProfile';
import AuthCreatePageSchool from '../components/CreateSchool';
import type { AuthStackParams } from '../index';
import getAuthStyles from '../styles/Styles';

type Props = {
  navigation: StackNavigationProp<AuthStackParams, 'Create'>;
  reqState: AccountRequestState;
  creationData?: AccountCreationData;
};

const AuthCreate: React.FC<Props> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const authStyles = getAuthStyles(theme);

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
        firstName: creationData.accountType === 'public' ? creationData.firstName : undefined,
        lastName: creationData.accountType === 'public' ? creationData.lastName : undefined,
      },
      device: {
        type: 'app',
        deviceId: null,
        canNotify: true,
      },
    };

    register(reqParams)
      .then(() => navigation.replace('CreateSuccess'))
      .catch((e) => {
        logger.info(reqParams);
        logger.warn('Failed to create account', e);
      });
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

        <ScrollView keyboardShouldPersistTaps="handled">
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
                component: (props) => <AuthCreatePageGeneral {...props} />,
              },
              {
                key: 'location',
                icon: 'school',
                title: 'École',
                component: (props) => (
                  <AuthCreatePageSchool
                    landing={() =>
                      navigation.push('Landing', {
                        screen: 'SelectLocation',
                        params: { goBack: true },
                      })
                    }
                    {...props}
                  />
                ),
              },
              {
                key: 'privacy',
                icon: 'shield',
                title: 'Vie privée',
                component: (props) => <AuthCreatePagePrivacy {...props} />,
              },
              {
                key: 'profile',
                icon: 'comment-account',
                title: 'Profil',
                component: (props) => (
                  <AuthCreatePageProfile
                    username={creationData.username || ''}
                    accountType={creationData.accountType || 'private'}
                    {...props}
                  />
                ),
              },
              {
                key: 'legal',
                icon: 'script-text',
                title: 'Conditions',
                component: (props) => (
                  <AuthCreatePageLegal
                    userEmail={creationData.email}
                    create={create}
                    navigation={navigation}
                    {...props}
                  />
                ),
              },
            ]}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { creationData: account.creationData, reqState: account.state };
};

export default connect(mapStateToProps)(AuthCreate);
