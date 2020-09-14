import React from 'react';
import { View, SectionList } from 'react-native';
import { Text, useTheme, List, Divider } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';

import getStyles from '@styles/Styles';

import type { AboutStackParams } from '../index';
import packages from '../data/packages.json';
import licenses from '../data/licenses.json';

type LicensesPropTypes = StackScreenProps<AboutStackParams, 'Licenses'>;

type Package = {
  id: string;
  name: string;
  license: string;
};

type License = {
  id: string;
  content: string;
};

function Licenses({ route }: LicensesPropTypes) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { page } = route.params || {};

  const licenseData = licenses.map((l: License) => ({
    id: l.id,
    content: l.content,
    data: packages.filter((p: Package) => p.license === l.id),
  }));

  return (
    <View style={styles.page}>
      {(page === 'list' || page === 'full') && (
        <View>
          <SectionList
            sections={licenseData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item title={item.id} />
              </View>
            )}
            renderSectionHeader={({ section: { id } }) => (
              <View style={{ marginTop: 30 }}>
                <List.Subheader>{id}</List.Subheader>
                <Divider />
                <View style={styles.contentContainer}>
                  <Text>
                    Les librairies suivantes, utilisées par l'application Topic, sont licensées sous{' '}
                    {id} :
                  </Text>
                </View>
              </View>
            )}
            renderSectionFooter={({ section: { content } }) => (
              <View>
                <Text>Contenu de la license:</Text>
                <Text>{content}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

export default Licenses;
