import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, ScrollView } from 'react-native';
import { Text, useTheme, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  PlatformBackButton,
  CustomTabView,
  TranslucentStatusBar,
  Illustration,
} from '@components/index';
import getStyles from '@styles/Styles';

import getLandingStyles from '../styles/Styles';

function LandingArticles({ navigation, route }) {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const landingStyles = getLandingStyles(theme);
  const viewpagerRef = React.createRef();

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView>
          <PlatformBackButton onPress={navigation.goBack} />
          <CustomTabView
            hideTabIndicator
            initialTab={route.params.index}
            pages={[
              {
                key: 'articles',
                title: 'Articles',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="article" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Articles</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Some long and boring description</Text>
                    </View>
                  </View>
                ),
              },
              {
                key: 'events',
                title: 'Évènements',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="event" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Évènements</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Some long and boring description</Text>
                    </View>
                  </View>
                ),
              },
              /* {
                key: 'petitions',
                title: 'Pétitions',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="petition" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Pétitions</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Some long and boring description</Text>
                    </View>
                  </View>
                ),
              }, */
              {
                key: 'explore',
                title: 'Explorer',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="explore" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Carte</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Some long and boring description</Text>
                    </View>
                  </View>
                ),
              },
              {
                key: 'groups',
                title: 'Groupes',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="group" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Groupes</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Some long and boring description</Text>
                    </View>
                  </View>
                ),
              },
            ]}
          />
        </ScrollView>
        <Divider />
        <View style={landingStyles.contentContainer}>
          <View style={landingStyles.buttonContainer}>
            <Button
              mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
              color={colors.primary}
              uppercase={Platform.OS !== 'ios'}
              onPress={() => navigation.navigate('Landing', { screen: 'SelectLocation' })} // TODO: This should point to the second view of the viewpager
              style={{ flex: 1 }}
            >
              Suivant
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default LandingArticles;

LandingArticles.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      index: PropTypes.number.isRequired,
    }),
  }).isRequired,
};
