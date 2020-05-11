import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { register, updateState } from '@redux/actions/data/account';
import StepperViewPager from '@components/StepperViewPager';

import AuthCreatePageGeneral from '../components/CreateGeneral';
import AuthCreatePageSchool from '../components/CreateSchool';
import AuthCreatePagePrivacy from '../components/CreatePrivacy';
import AuthCreatePageProfile from '../components/CreateProfile';
import AuthCreatePageLegal from '../components/CreateLegal';

function AuthCreate({ navigation, reqState, creationData }) {
  const viewPagerRef = React.useRef();

  const create = () => {
    const reqParams = {
      accountInfo: {
        username: creationData.username,
        email: creationData.email,
        password: creationData.password,
        global: creationData.global,
        schools: creationData.schools,
        departments: creationData.departments,
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

    register(reqParams);
  };

  const restart = () => {
    updateState({ error: null, success: null, loading: null });
    viewPagerRef.current.setPage(0);
  };

  return (
    <StepperViewPager
      navigation={navigation}
      viewPagerRef={viewPagerRef}
      reqState={reqState}
      pages={[
        {
          icon: 'account',
          label: 'General',
          component: AuthCreatePageGeneral,
          scrollToBottom: true,
          height: 350,
        },
        { icon: 'school', label: 'École', component: AuthCreatePageSchool, height: 250 },
        { icon: 'shield', label: 'Vie privée', component: AuthCreatePagePrivacy, height: 550 },
        {
          icon: 'comment-account',
          label: 'Profil',
          component: AuthCreatePageProfile,
          scrollToBottom: true,
          height: 260,
        },
        {
          icon: 'script-text',
          label: 'Conditions',
          component: AuthCreatePageLegal,
          params: { userEmail: creationData.email, create },
          height: 950,
        },
      ]}
      success={{
        icon: 'account-check-outline',
        title: 'Compte Crée',
        actions: [
          {
            label: 'Continuer',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Home1',
                params: { screen: 'Home2', params: { screen: 'Article' } },
              }),
          },
        ],
      }}
      failure={{
        icon: 'account-remove-outline',
        title: 'Erreur lors de la création du compte',
        description:
          'Veuillez vérifier votre connexion internet, réessayer en vérifiant que les données soient correctes ou signaler un bug depuis le menu principal',
        actions: [
          {
            label: 'Réessayer',
            onPress: () => restart(),
          },
          {
            label: 'Continuer',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Home1',
                params: { screen: 'Home2', params: { screen: 'Article' } },
              }),
          },
        ],
      }}
    />
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
  }).isRequired,
  creationData: PropTypes.shape({
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
    error: PropTypes.any,
    success: PropTypes.bool,
    loading: PropTypes.bool,
  }),
};
