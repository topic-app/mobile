import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { CustomTabView, TranslucentStatusBar, CustomHeaderBar } from '@components/index';
import { fetchDocument } from '@redux/actions/api/legal';
import getStyles from '@styles/Styles';
import { State, LegalState, LegalRequestState } from '@ts/types';
import { useTheme } from '@utils/index';

import LegalPage from '../components/LegalPage';
import type { AboutStackParams } from '../index';

type LegalProps = StackScreenProps<AboutStackParams, 'Legal'> & {
  legal: LegalState;
  state: LegalRequestState;
};

const Legal: React.FC<LegalProps> = ({ route, legal, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { page } = route.params || {};

  const fetch = () => {
    fetchDocument('conditions');
    fetchDocument('confidentialite');
    fetchDocument('mentions');
  };

  React.useEffect(fetch, []);

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Légal',
            },
          },
        }}
      />
      <View style={styles.centeredPage}>
        <ScrollView>
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
        </ScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { legal } = state;
  return { legal, state: legal.state };
};

export default connect(mapStateToProps)(Legal);
