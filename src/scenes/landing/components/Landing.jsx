import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, Image, ScrollView } from 'react-native';
import { Text, useTheme, Button, List, Divider, DarkTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from '@styles/Styles';
import ViewPager from '@react-native-community/viewpager';
import shortid from 'shortid';
import getLandingStyles from '../styles/Styles';
import { TranslucentStatusBar } from '../../../components/Header';

const topicIcon = require('@assets/images/topic-icon-circle.png');

function WelcomeLanding({ forward, navigation }) {
  const theme = useTheme();
  const landingStyles = getLandingStyles(theme);

  const items = [
    {
      title: 'Articles',
      description:
        "Découvrez l'actu lycéenne en suivant vos groupes favoris et écrivez vos propres articles",
      text: "Une description un peu plus longue de ce qu'on peut faire",
      icon: 'newspaper',
    },
    {
      title: 'Évènements',
      description: 'Découvrez les prochains évènements pour la jeunesse autour de vous',
      text: "Une description un peu plus longue de ce qu'on peut faire",
      icon: 'calendar',
    },
    {
      title: 'Pétitions',
      description:
        'Faites entendre votre voix en signant ou créant des pétitions et en répondant aux votes',
      text: "Une description un peu plus longue de ce qu'on peut faire",
      icon: 'comment-check-outline',
    },
    {
      title: 'Explorer',
      description:
        'Découvrez les évènements et les lieux proches de vous avec une carte interactive',
      text: "Une description un peu plus longue de ce qu'on peut faire",
      icon: 'compass-outline',
    },
    {
      divider: true,
      title: 'Groupes',
      description:
        'Rejoignez et créez des groupes et représentez vos associations, organisations et clubs favoris',
      text: "Une description un peu plus longue de ce qu'on peut faire",
      icon: 'account-group-outline',
    },
  ];

  return (
    <View style={landingStyles.landingPage}>
      <ScrollView>
        <View style={landingStyles.headerContainer}>
          <View style={landingStyles.centerContainer}>
            <Image source={topicIcon} style={{ width: 256, height: 256 }} />
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
                  onPress={() => navigation.navigate('Landing', { screen: 'Articles' })}
                />
              </View>
            ))}
          </List.Section>
        </View>
      </ScrollView>
      <Divider theme={DarkTheme} />
      <View style={landingStyles.contentContainer}>
        <View style={landingStyles.buttonContainer}>
          <Button
            mode="contained"
            color="white"
            uppercase={Platform.OS !== 'ios'}
            onPress={forward}
            style={{ flex: 1 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    </View>
  );
}

WelcomeLanding.propTypes = {
  forward: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default WelcomeLanding;
