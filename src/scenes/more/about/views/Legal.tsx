import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import CustomTabView from '@components/CustomTabView';
import getStyles from '@styles/Styles';
import { State, LegalState, LegalRequestState } from '@ts/types';
import { connect } from 'react-redux';
import LegalPage from '../components/LegalPage';
import { fetchDocument } from '@redux/actions/api/legal';

type LegalPropTypes = {
  navigation: any;
  route: { params: { page?: 'conditions' | 'conditions' | 'confidentialite' } };
  legal: LegalState;
  state: LegalRequestState;
};

function Legal({ navigation, route, legal, state }: LegalPropTypes) {
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
              title: 'Confidentialité',
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
  );
}

const mapStateToProps = (state: State) => {
  const { legal } = state;
  return { legal, state: legal.state };
};

export default connect(mapStateToProps)(Legal);
