import React from 'react';
import { View, Platform, ScrollView, Linking } from 'react-native';
import { Text, Button, Divider, List, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TranslucentStatusBar, Illustration } from '@components';

import type { LandingScreenNavigationProp } from '.';
import getStyles from './styles';

type LandingArticlesProps = {
  navigation: LandingScreenNavigationProp<'Beta'>;
};

const LandingArticles: React.FC<LandingArticlesProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const landingStyles = getStyles(theme);

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView>
          <View>
            <View style={landingStyles.headerContainer}>
              <View style={landingStyles.centerIllustrationContainer}>
                <View style={{ marginVertical: 10 }}>
                  <Illustration name="topic-icon" height={80} width={80} />
                </View>
                <Text style={landingStyles.sectionTitle}>Topic · Bêta publique</Text>
              </View>
            </View>
            <View style={landingStyles.contentContainer}>
              <Text>Merci d&apos;avoir rejoint la bêta publique de Topic !{'\n'}</Text>
              <Text>
                Voila quelques informations sur le déroulement de la bêta et comment vous pouvez
                nous aider à déveloper l&apos;application.{'\n\n'}
                Comme l&apos;application est toujours en bêta, elle peut être instable, et vous
                rencontrerez sûrement des bugs.
              </Text>
            </View>
          </View>
          <View>
            <List.Item
              title="Feedback"
              description={`Utilisez l'élément "Feedback" depuis ${
                Platform.OS === 'ios' ? 'la section Plus' : 'le menu'
              } pour donner votre avis sur l'application ou signaler un bug`}
              left={() => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <List.Icon
                    color={colors.background}
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 20,
                    }}
                    icon="bug"
                  />
                </View>
              )}
              descriptionNumberOfLines={3}
            />
            <List.Item
              title="Canal Telegram"
              description="Recevez les dernières infos et discutez avec les développeurs et les autres bêta-testeurs"
              left={() => (
                <View
                  style={{
                    margin: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Illustration name="telegram" height={40} width={40} />
                </View>
              )}
              right={() => <List.Icon icon="open-in-new" color={colors.subtext} />}
              descriptionNumberOfLines={3}
              onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfRz29dT2eYy9w_7A')}
            />
            <List.Item
              title="Plantages"
              description="Certains rapports de plantage sont envoyés automatiquement, mais nous vous conseillons de les signaler"
              left={() => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <List.Icon
                    color={colors.background}
                    style={{
                      backgroundColor: colors.disabled,
                      borderRadius: 20,
                    }}
                    icon="pulse"
                  />
                </View>
              )}
              descriptionNumberOfLines={3}
            />
            <List.Item
              title="Statistiques"
              description="Topic envoie automatiquement des informations anonymes sur votre interaction avec l'application. Vous pouvez désactiver l'envoi depuis les paramètres"
              left={() => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <List.Icon
                    color={colors.background}
                    style={{
                      backgroundColor: colors.disabled,
                      borderRadius: 20,
                    }}
                    icon="chart-timeline-variant"
                  />
                </View>
              )}
              descriptionNumberOfLines={3}
            />
            <List.Item
              title="Mises à jour"
              description="Nous publions des mises à jour toutes les semaines environ. Vous pouvez regarder les notes de mise à jour pour voir les fonctionnalités à tester"
              left={() => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <List.Icon
                    color={colors.background}
                    style={{
                      backgroundColor: colors.disabled,
                      borderRadius: 20,
                    }}
                    icon="update"
                  />
                </View>
              )}
              descriptionNumberOfLines={3}
            />
          </View>
        </ScrollView>
        <View>
          <Divider />
          <View style={landingStyles.contentContainer}>
            <View style={landingStyles.buttonContainer}>
              <Button
                mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                color={colors.primary}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => navigation.navigate('Landing', { screen: 'SelectLocation' })}
                style={{ flex: 1 }}
              >
                Suivant
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LandingArticles;
