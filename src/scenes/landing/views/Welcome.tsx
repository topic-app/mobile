import React from 'react';
import { View, Platform, ScrollView } from 'react-native';
import { Text, useTheme, Button, List, Divider, DarkTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import shortid from 'shortid';

import TopicIcon from '@assets/images/topic-icon.svg';
import { TranslucentStatusBar } from '@components/Header';
import { PlatformTouchable } from '@components/index';
import { updateSchools } from '@redux/actions/api/schools';
import { updateDepartments } from '@redux/actions/api/departments';

import type { LandingStackParams } from '../index';
import getLandingStyles from '../styles/Styles';

const items = [
  {
    index: 0,
    title: 'Articles',
    description:
      "Découvrez l'actu lycéenne en suivant vos groupes favoris et écrivez vos propres articles",
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'newspaper',
  },
  {
    index: 1,
    title: 'Évènements',
    description: 'Découvrez les prochains évènements pour la jeunesse autour de vous',
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'calendar',
  },
  /* {
    index: 2,
    title: 'Pétitions',
    description:
      'Faites entendre votre voix en signant ou créant des pétitions et en répondant aux votes',
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'comment-check-outline',
  }, */
  {
    index: 2,
    title: 'Explorer',
    description: 'Découvrez les évènements et les lieux proches de vous avec une carte interactive',
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'compass-outline',
  },
  {
    index: 3,
    divider: true,
    title: 'Groupes',
    description:
      'Rejoignez et créez des groupes et représentez vos associations, organisations et clubs favoris',
    text: "Une description un peu plus longue de ce qu'on peut faire",
    icon: 'account-group-outline',
  },
];

type Props = {
  navigation: StackNavigationProp<LandingStackParams, 'Welcome'>;
};

const LandingWelcome: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const landingStyles = getLandingStyles(theme);

  React.useEffect(() => {
    // Preload écoles & departments pour utiliser après dans SelectLocation
    updateDepartments('initial');
  }, []);

  return (
    <View style={landingStyles.landingPage}>
      <TranslucentStatusBar barStyle="light-content" />
      <ScrollView>
        <View style={landingStyles.headerContainer}>
          <View style={landingStyles.centerContainer}>
            <TopicIcon height={256} width={256} />
            <Text theme={DarkTheme} style={landingStyles.title}>
              Topic
            </Text>
          </View>
        </View>
        <View style={landingStyles.contentContainer}>
          <List.Section>
            <List.Subheader theme={DarkTheme}>Découvrez l&apos;application</List.Subheader>
            {items.map((item) => (
              <View key={shortid()}>
                {item.divider && <Divider theme={DarkTheme} />}
                <List.Item
                  theme={DarkTheme}
                  title={item.title}
                  description={item.description}
                  left={({ color }) => <List.Icon color={color} icon={item.icon} />}
                  right={({ color }) => <List.Icon color={color} icon="chevron-right" />}
                  onPress={() => navigation.navigate('Info', { index: item.index })}
                />
              </View>
            ))}
          </List.Section>
          <Divider theme={DarkTheme} />
          <View>
            <PlatformTouchable onPress={() => navigation.navigate('Info', { index: 4 })}>
              <View
                style={{
                  marginVertical: 30,
                  marginHorizontal: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: 'white', opacity: 0.5 }}>Association Topic App</Text>
                <Text style={{ color: 'white', opacity: 0.5 }}>Sponsors</Text>
              </View>
            </PlatformTouchable>
          </View>
        </View>
      </ScrollView>
      <Divider theme={DarkTheme} />
      <View style={landingStyles.contentContainer}>
        <View style={landingStyles.buttonContainer}>
          <Button
            mode="contained"
            color="white"
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              navigation.navigate('SelectLocation');
            }}
            style={{ flex: 1 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    </View>
  );
};

export default LandingWelcome;
