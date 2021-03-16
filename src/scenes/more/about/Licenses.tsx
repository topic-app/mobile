import licenses from '@assets/json/licenses.json';
import packages from '@assets/json/packages.json';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, SectionList } from 'react-native';
import { Text, List, Divider, useTheme } from 'react-native-paper';

import getStyles from '@styles/global';

import type { AboutStackParams } from '.';

type Package = {
  id: string;
  name: string;
  license: string;
};

type License = {
  id: string;
  content: string;
};

type LicensesProps = StackScreenProps<AboutStackParams, 'Licenses'>;

const Licenses: React.FC<LicensesProps> = ({ route }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { page } = route.params || {};

  const licenseData = licenses.map((l: License) => ({
    id: l.id,
    content: l.content,
    data: (packages as Package[]).filter((p: Package) => p.license === l.id),
  }));

  return (
    <View style={styles.page}>
      {(page === 'list' || page === 'full') && (
        <View>
          <SectionList
            sections={licenseData}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            renderItem={({ item }: { item: Package }) => (
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
                    Les librairies suivantes, utilisées par l&apos;application Topic, sont licensées
                    sous {id} :
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
};

export default Licenses;
