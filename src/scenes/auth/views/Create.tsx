import React from 'react';
import { connect } from 'react-redux';

import { View, ScrollView } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { State, AccountRequestState, CreationData } from '@ts/types';
import { logger } from '@utils/index';
import {
  TranslucentStatusBar,
  StepperView,
  ErrorMessage,
  Illustration,
  PlatformBackButton,
} from '@components/index';
import { register } from '@redux/actions/data/account';
import getStyles from '@styles/Styles';

import type { AuthStackParams } from '../index';
import getAuthStyles from '../styles/Styles';
import AuthCreatePageGeneral from '../components/CreateGeneral';
import AuthCreatePageSchool from '../components/CreateSchool';
import AuthCreatePagePrivacy from '../components/CreatePrivacy';
import AuthCreatePageProfile from '../components/CreateProfile';
import AuthCreatePageLegal from '../components/CreateLegal';

type Props = {
  navigation: StackNavigationProp<AuthStackParams, 'Create'>;
  reqState: AccountRequestState;
  creationData?: CreationData;
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
        firstName: creationData.accountType === 'public' ? creationData.firstName : null,
        lastName: creationData.accountType === 'public' ? creationData.lastName : null,
      },
      device: {
        type: 'app',
        deviceId: null,
        canNotify: true,
      },
    };

    register(reqParams)
      .then(() => navigation.navigate('CreateSuccess'))
      .catch((e) => {
        logger.info(reqParams);
        logger.error('Failed to create account', e);
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
                component: (
                  <AuthCreatePageSchool
                    landing={() =>
                      navigation.navigate('Landing', {
                        screen: 'SelectLocation',
                        params: { goBack: true },
                      })
                    }
                  />
                ),
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
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { creationData: account.creationData, reqState: account.state };
};

export default connect(mapStateToProps)(AuthCreate);
