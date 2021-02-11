import React from 'react';
import { View, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Divider, List, Subheading, Text } from 'react-native-paper';

import { Content, ErrorMessage, PlatformTouchable } from '@components/index';
import getStyles from '@styles/Styles';
import { RequestState } from '@ts/types';
import { handleUrl, openUrl, useTheme } from '@utils/index';

import { AboutScreenNavigationProp } from '../index';
import getLocalStyles from '../styles/Styles';

type props = {
  navigation: AboutScreenNavigationProp<'Legal'>;
};

const LicensesPage: React.FC<props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  return (
    <View>
      <View style={styles.contentContainer}>
        <Subheading>Topic</Subheading>
        <Text>
          L&apos;application Topic est un logiciel libre, vous pouvez trouver le code source sur la
          page{' '}
          <Text style={styles.link} onPress={() => openUrl('https://gitlab.com/topicapp/mobile')}>
            https://gitlab.com/topicapp/mobile
          </Text>
          .{'\n'}N&apos;hésitez pas à regarder et à contribuer si vous en avez envie, nous pourrons
          vous aider si besoin. {'\n\n'}
          Topic Mobile Copyright (C) 2020 Topic App (W061014585) {'\n'}This program is free
          software: you can redistribute it and/or modify it under the terms of the GNU Affero
          General Public License as published by the Free Software Foundation, either version 3 of
          the License, or (at your option) any later version. {'\n'}This program is distributed in
          the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
          warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. {'\n'}See the GNU Affero
          General Public License for more details. You should have received a copy of the GNU Affero
          General Public License along with this program. If not, see https://www.gnu.org/licenses/.
        </Text>
      </View>
      <View style={{ height: 40 }} />
      <Divider />
      <View style={styles.contentContainer}>
        <Subheading>Librairies et ressources</Subheading>
        <Text>
          Nous remercions les projets et les personnes qui nous ont fourni les outils et éléments
          nécessaires à cette application.{'\n'}Pour tous les projets open-source, vous trouverez
          ci-dessous des liens vers chacun des projets et la license sous laquelle il se trouve.
        </Text>
      </View>
      <List.Item
        title="Logo et ressources"
        description="© Ella Nitters (ellanitters.com)"
        onPress={() => openUrl('https://ellanitters.com')}
        right={() => <List.Icon icon="open-in-new" />}
      />
      <List.Item
        title="Illustrations"
        description="© Katerina Limpitsouni (undraw.co)"
        onPress={() => openUrl('https://undraw.co')}
        right={() => <List.Icon icon="open-in-new" />}
      />
      <List.Item
        title="Données cartographiques"
        description="© OpenMapTiles © OpenStreetMap Contributors"
        onPress={() => openUrl('https://openstreetmap.org/copyright')}
        right={() => <List.Icon icon="open-in-new" />}
      />
      <List.Item
        title="Librairies"
        description="Toutes les licenses open-source"
        right={() => <List.Icon icon="chevron-right" />}
        onPress={() => navigation.navigate('Licenses', { page: 'full' })}
      />
    </View>
  );
};

export default LicensesPage;
