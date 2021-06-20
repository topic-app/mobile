import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { connect } from 'react-redux';

import { CustomTabView, PageContainer } from '@components';
import { fetchDocument } from '@redux/actions/api/legal';
import { State, LegalState, LegalRequestState } from '@ts/types';

import type { AboutStackParams } from '.';
import LegalPage from './components/LegalPage';

type LegalProps = StackScreenProps<AboutStackParams, 'Legal'> & {
  legal: LegalState;
  state: LegalRequestState;
};

const Legal: React.FC<LegalProps> = ({ route, legal, state }) => {
  const { page } = route.params || {};

  const fetch = () => {
    fetchDocument('conditions');
    fetchDocument('confidentialite');
    fetchDocument('mentions');
  };

  React.useEffect(fetch, []);

  return (
    <PageContainer headerOptions={{ title: 'Légal' }} centered scroll>
      <CustomTabView
        scrollEnabled={false}
        initialTab={{ mentions: 0, conditions: 1, confidentialite: 2 }[page || 'mentions']}
        pages={[
          {
            key: 'mentions',
            title: 'Mentions',
            component: (
              <LegalPage
                content={legal.mentions}
                state={state.mentions}
                fetch={fetch}
                strings={{
                  what: 'la récupération des mentions légales',
                  contentPlural: 'Les mentions légales',
                }}
              />
            ),
          },
          {
            key: 'conditions',
            title: 'Conditions',
            component: (
              <LegalPage
                content={legal.conditions}
                state={state.conditions}
                fetch={fetch}
                strings={{
                  what: "la récupération des conditions générales d'utilisation",
                  contentPlural: "Les conditions générales d'utilisation",
                }}
              />
            ),
          },
          {
            key: 'confidentialite',
            title: 'Vie privée',
            component: (
              <LegalPage
                content={legal.confidentialite}
                state={state.confidentialite}
                fetch={fetch}
                strings={{
                  what: 'la récupération de la politique de confidentialité',
                  contentSingular: 'La politique de confidentialité',
                }}
              />
            ),
          },
        ]}
      />
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { legal } = state;
  return { legal, state: legal.state };
};

export default connect(mapStateToProps)(Legal);
