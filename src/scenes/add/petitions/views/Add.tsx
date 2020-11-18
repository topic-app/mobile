import React from 'react';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import ViewPager from '@react-native-community/viewpager';

import { PetitionRequestState, State } from '@ts/types';
import { updateState } from '@redux/actions/data/account';
import StepperView from '@components/StepperView';

import type { PetitionAddStackParams } from '../index';
import PetitionAddPageGeneral from '../components/AddGeneral';
import PetitionAddPageLocation from '../components/AddLocation';
import PetitionAddPageGoals from '../components/AddGoals';
import PetitionAddPageDescription from '../components/AddDescription';

type PetitionAddProps = {
  navigation: StackNavigationProp<PetitionAddStackParams, 'Add'>;
  reqState: PetitionRequestState;
  // TODO: Define PetitionCreationData
  creationData: PetitionCreationData;
};

const PetitionAdd: React.FC<PetitionAddProps> = ({ navigation, reqState, creationData }) => {
  const viewPagerRef = React.createRef<ViewPager>();

  const restart = () => {
    updateState({ error: null, success: null, loading: null });
    viewPagerRef.current?.setPage(0);
  };

  return (
    <StepperView
      viewPagerRef={viewPagerRef}
      reqState={reqState}
      title="Créer une pétition"
      pages={[
        {
          key: 'title',
          icon: 'comment-outline',
          title: 'Titre',
          component: (props) => <PetitionAddPageGeneral {...props} />,
        },
        {
          key: 'schools',
          icon: 'map-marker',
          title: 'Écoles',
          component: (props) => <PetitionAddPageLocation {...props} />,
        },
        {
          key: 'description',
          icon: 'script-text',
          title: 'Description',
          component: (props) => <PetitionAddPageDescription {...props} />,
        },
        {
          key: 'goals',
          icon: 'check-decagram',
          title: 'Objectifs',
          component: (props) => <PetitionAddPageGoals {...props} />,
        },
      ]}
      success={{
        icon: 'account-check-outline',
        title: 'Pétition ajoutée',
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
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { creationData: account.creationData, reqState: account.state };
};

export default connect(mapStateToProps)(PetitionAdd);
