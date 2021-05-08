import React from 'react';
import { View, Platform, FlatList } from 'react-native';
import { List, Checkbox, useTheme, Title, Text, Divider, Button } from 'react-native-paper';

import { WelcomeWavesBottom, WelcomeWavesTop } from '@assets/index';
import { GroupCard, Illustration } from '@components';
import getStyles from '@styles/global';
import { GroupPreload } from '@ts/types';

const groups: GroupPreload[] = Array(30).fill({
  preload: true,
  _id: 'test',
  name: 'Topic',
  displayName: 'Topic',
  type: 'administrateur',
  cache: {
    members: 8,
    followers: 1000,
  },
  summary: 'Un groupe de test, pas le vrai groupe Topic',
});

const WelcomeAbout: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <View style={{ flex: 1 }}>
      <WelcomeWavesTop width="100%" height="150" />
      <View style={{ backgroundColor: '#592989', marginVertical: -13 }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            marginVertical: 60,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Illustration name="article" />
            <Title style={[styles.title, { color: 'white' }]}>Actus</Title>
            <Text style={[{ color: 'white' }]}>
              Découvrez machin chose et l'actu citoyenne et blabla
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Illustration name="event" />
            <Title style={[styles.title, { color: 'white' }]}>Évènements</Title>
            <Text style={[{ color: 'white' }]}>
              Découvrez machin chose et l'actu citoyenne et blabla
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Illustration name="explore" />
            <Title style={[styles.title, { color: 'white' }]}>Carte</Title>
            <Text style={[{ color: 'white' }]}>
              Découvrez machin chose et l'actu citoyenne et blabla
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Illustration name="group" />
            <Title style={[styles.title, { color: 'white' }]}>Groupes</Title>
            <Text style={[{ color: 'white' }]}>
              Découvrez machin chose et l'actu citoyenne et blabla
            </Text>
          </View>
        </View>
      </View>
      <WelcomeWavesBottom width="100%" height="150" />
      <View style={[{ marginTop: 60 }]}>
        <View style={[styles.centerIllustrationContainer, { marginBottom: 30 }]}>
          <Title style={styles.title}>Groupes populaires</Title>
        </View>
        <FlatList
          horizontal
          data={groups}
          renderItem={({ item }) => <GroupCard group={item} navigate={() => {}} />}
        />
      </View>
      <View style={{ marginBottom: 30 }}></View>
      <Divider />
      <View
        style={[
          styles.container,
          {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        ]}
      >
        <View style={{ flex: 1, alignContent: 'center', marginTop: -5 }}>
          <Illustration name="topic-icon-text" height="50" />
        </View>
        <Button mode="text" color={colors.disabled} uppercase={false}>
          À propos
        </Button>
        <Button mode="text" color={colors.disabled} uppercase={false}>
          Partenaires
        </Button>
        <Button mode="text" color={colors.disabled} uppercase={false}>
          Mentions légales
        </Button>
        <Button mode="text" color={colors.disabled} uppercase={false}>
          Conditions d'utilisation
        </Button>
        <Button mode="text" color={colors.disabled} uppercase={false}>
          Vie privée
        </Button>
      </View>
    </View>
  );
};

export default WelcomeAbout;
