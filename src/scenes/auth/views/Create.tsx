import React from 'react';
import { View, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
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
import { getApiDevice } from '@utils/firebase';
import { Errors, logger, useTheme, trackEvent } from '@utils/index';

import AuthCreatePageGeneral from '../components/CreateGeneral';
import AuthCreatePageLegal from '../components/CreateLegal';
import AuthCreatePagePrivacy from '../components/CreatePrivacy';
import AuthCreatePageProfile from '../components/CreateProfile';
import type { AuthScreenNavigationProp } from '../index';
import getAuthStyles from '../styles/Styles';

type AuthCreateProps = {
  navigation: AuthScreenNavigationProp<'Create'>;
  reqState: AccountRequestState;
  creationData?: AccountCreationData;
};

const AuthCreate: React.FC<AuthCreateProps> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const authStyles = getAuthStyles(theme);

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => trackEvent('auth:create-page-general'), []);

  const create = async () => {
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
      device: await getApiDevice(),
    };

    register(reqParams)
      .then(() => {
        trackEvent('auth:create-success');
        navigation.replace('CreateSuccess');
      })
      .catch((error) => {
        Errors.showPopup({
          type: 'axios',
          what: 'la création du compte',
          error,
          retry: create,
        });
      });
  };

  if (Platform.OS === 'web') {
    return <View style={styles.page}>Accès non autorisé</View>;
  }

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'}>
          {reqState.register.loading || reqState.check.loading ? (
            <ProgressBar indeterminate />
          ) : (
            <View style={{ height: 4 }} />
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
          <ScrollView keyboardShouldPersistTaps="handled" ref={scrollViewRef}>
            <PlatformBackButton onPress={navigation.goBack} />
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="auth-register" height={200} width={200} />
              <Text style={authStyles.title}>Créer un compte</Text>
            </View>
            <StepperView
              onChange={() => scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })}
              pages={[
                {
                  key: 'general',
                  icon: 'account',
                  title: 'General',
                  component: (props) => <AuthCreatePageGeneral {...props} />,
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
                      landing={() =>
                        navigation.push('Landing', {
                          screen: 'SelectLocation',
                          params: { goBack: true },
                        })
                      }
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
                      createLoading={reqState.login.loading}
                      {...props}
                    />
                  ),
                },
              ]}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { creationData: account.creationData, reqState: account.state };
};

export default connect(mapStateToProps)(AuthCreate);
