import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Linking, FlatList, Dimensions } from 'react-native';
import { Text, useTheme, List } from 'react-native-paper';
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

type License = {
  id: string;
  name: string;
  repository: string;
  licenseSources: {
    package: {
      sources: { license: string; url: string }[];
    };
    license: {
      sources: { text: string; names: () => string[] }[];
    };
  };
};

function Legal({ route }: LegalPropTypes) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const licenses = require('../data/licenses.json');

  const { page } = route.params || {};

  return (
    <View style={styles.page}>
      <ScrollView>
        {(page === 'list' || page === 'full') && (
          <View>
            <FlatList
              data={licenses}
              keyExtractor={(i) => i.id}
              renderItem={({ item }: { item: License }) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  descriptionNumberOfLines={1000}
                  description={
                    page === 'list'
                      ? `License ${
                          item.licenseSources.package?.sources[0]?.license ||
                          item.licenseSources.license?.sources[0]?.names()
                        }`
                      : item.licenseSources.license?.sources[0]?.text ||
                        `License ${item.licenseSources.package?.sources[0]?.license} disponible à ${item.licenseSources.package?.sources[0]?.url}`
                  }
                  onPress={() => handleUrl(item.repository)}
                />
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default Legal;
