/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, ScrollView } from 'react-native';
import getStyles from '@styles/Styles';
import ViewPager from '@react-native-community/viewpager';
import { Text, useTheme, Button, List, Divider, DarkTheme } from 'react-native-paper';
import shortid from 'shortid';
import TopicIcon from '@assets/images/topic-icon.svg';
import getLandingStyles from '../styles/Styles';

function LandingWelcome({ navigation }) {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const landingStyles = getLandingStyles(theme);

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
    {
      index: 2,
      title: 'Pétitions',
      description:
        'Faites entendre votre voix en signant ou créant des pétitions et en répondant aux votes',
      text: "Une description un peu plus longue de ce qu'on peut faire",
      icon: 'comment-check-outline',
    },
    {
      index: 3,
      title: 'Explorer',
      description:
        'Découvrez les évènements et les lieux proches de vous avec une carte interactive',
      text: "Une description un peu plus longue de ce qu'on peut faire",
      icon: 'compass-outline',
    },
    {
      index: 4,
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
                  onPress={() =>
                    navigation.navigate('Landing', {
                      screen: 'Info',
                      params: { index: item.index },
                    })
                  }
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
            onPress={() => {
              navigation.navigate('Landing', { screen: 'SelectLocation' });
            }}
            style={{ flex: 1 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    </View>
  );
}

export default LandingWelcome;

LandingWelcome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
