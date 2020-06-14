import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, Image, ScrollView } from 'react-native';
import { Text, useTheme, Button, List, Divider, DarkTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from '@styles/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlatformBackButton } from '@components/PlatformComponents';
import CustomTabView from '@components/CustomTabView';

import { TranslucentStatusBar } from '@components/Header';

import IllustrationArticlesLight from '@assets/images/illustrations/articles/articles_light.svg';
import IllustrationArticlesDark from '@assets/images/illustrations/articles/articles_dark.svg';
import IllustrationEventsLight from '@assets/images/illustrations/events/events_light.svg';
import IllustrationEventsDark from '@assets/images/illustrations/events/events_dark.svg';
import IllustrationPetitionsLight from '@assets/images/illustrations/petitions/petitions_light.svg';
import IllustrationPetitionsDark from '@assets/images/illustrations/petitions/petitions_dark.svg';
import IllustrationExploreLight from '@assets/images/illustrations/explore/explore_light.svg';
import IllustrationExploreDark from '@assets/images/illustrations/explore/explore_dark.svg';
import IllustrationGroupsLight from '@assets/images/illustrations/groups/groups_light.svg';
import IllustrationGroupsDark from '@assets/images/illustrations/groups/groups_dark.svg';
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
                        {theme.dark ? (
                          <IllustrationArticlesDark height={300} width={300} />
                        ) : (
                          <IllustrationArticlesLight height={300} width={300} />
                        )}
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
                        {theme.dark ? (
                          <IllustrationEventsDark height={300} width={300} />
                        ) : (
                          <IllustrationEventsLight height={300} width={300} />
                        )}
                        <Text style={landingStyles.sectionTitle}>Évènements</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Some long and boring description</Text>
                    </View>
                  </View>
                ),
              },
              {
                key: 'petitions',
                title: 'Pétitions',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        {theme.dark ? (
                          <IllustrationPetitionsDark height={300} width={300} />
                        ) : (
                          <IllustrationPetitionsLight height={300} width={300} />
                        )}
                        <Text style={landingStyles.sectionTitle}>Pétitions</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Some long and boring description</Text>
                    </View>
                  </View>
                ),
              },
              {
                key: 'explore',
                title: 'Explorer',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        {theme.dark ? (
                          <IllustrationExploreDark height={300} width={300} />
                        ) : (
                          <IllustrationExploreLight height={300} width={300} />
                        )}
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
                        {theme.dark ? (
                          <IllustrationGroupsDark height={300} width={300} />
                        ) : (
                          <IllustrationGroupsLight height={300} width={300} />
                        )}
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
