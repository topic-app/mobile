import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Linking, FlatList, Dimensions } from 'react-native';
import { Text, useTheme, List, Divider } from 'react-native-paper';
import CustomTabView from '@components/CustomTabView';
import getStyles from '@styles/Styles';
import { State, LegalState, LegalRequestState } from '@ts/types';
import { connect } from 'react-redux';
import LegalPage from '../components/LegalPage';
import { fetchDocument } from '@redux/actions/api/legal';
import { handleUrl } from '@utils/index';

type LegalPropTypes = {
  navigation: any;
  route: { params: { page?: 'list' | 'full' | 'logo' | 'illustrations' } };
  legal: LegalState;
  state: LegalRequestState;
};

type Package = {
  id: string;
  name: string;
  license: string;
};

type License = {
  id: string;
  content: string;
};

function Legal({ route }: LegalPropTypes) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const packages = require('../data/packages.json');
  const licenses = require('../data/licenses.json');

  const { page } = route.params || {};

  return (
    <View style={styles.page}>
      <ScrollView>
        {(page === 'list' || page === 'full') && (
          <View>
            {licenses.map((l: License) => (
              <View style={{ marginTop: 30 }} key={l.id}>
                <List.Subheader>{l.id}</List.Subheader>
                <Divider />
                <View style={styles.contentContainer}>
                  <Text>
                    Les librairies suivantes, utilisées par l'application Topic, sont licensées sous{' '}
                    {l.id} :
                  </Text>
                  <FlatList
                    data={packages.filter((p: Package) => p.license === l.id)}
                    keyExtractor={(p) => p.id}
                    renderItem={({ item }: { item: Package }) => <List.Item title={item.id} />}
                  />
                  <Text>Contenu de la license:</Text>
                  <Text>{l.content}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default Legal;
