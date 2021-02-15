import React from 'react';
import { View, Platform, ScrollView, Linking, Image, TouchableWithoutFeedback } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';

import { TranslucentStatusBar, Illustration, SafeAreaView } from '@components/index';
import getStyles from '@styles/Styles';
import { useTheme } from '@utils/index';

import type { LandingScreenNavigationProp } from '../index';
import getLandingStyles from '../styles/Styles';

type LandingArticlesProps = {
  navigation: LandingScreenNavigationProp<'Beta'>;
};

const LandingArticles: React.FC<LandingArticlesProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const landingStyles = getLandingStyles(theme);

  const scrollViewRef = React.useRef<ScrollView>(null);

  const [currentChouette, setCurrentChouette] = React.useState(0);

  const chouettes = [
    require('@assets/images/chouettes/article.png'),
    require('@assets/images/chouettes/main.png'),
    require('@assets/images/chouettes/party.png'),
    require('@assets/images/chouettes/thinking.png'),
    require('@assets/images/chouettes/crying.png'),
    require('@assets/images/chouettes/phone.png'),
  ];

  const nextChouette = () => {
    setCurrentChouette((currentChouette + 1) % chouettes.length);
  };

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView ref={scrollViewRef}>
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
                nous aider à developper l&apos;application.{'\n'}
              </Text>
            </View>
          </View>
          <View>
            <View style={landingStyles.centerIllustrationContainer}>
              <Illustration name="beta-messages" height={200} width={200} />
              <Text style={landingStyles.sectionSubtitle}>Feedback</Text>
            </View>
            <View style={landingStyles.contentContainer}>
              <Text>
                Vous trouverez régulièrement des encarts vous permettant de donner votre avis sur
                différentes fonctionnalités dans l&apos;application, via de courts questionnaires.
              </Text>
              <Text style={{ fontWeight: 'bold', marginTop: 15 }}>
                Vous pouvez aussi donner votre avis et signaler des bugs via l&apos;élément
                &quot;Feedback&quot; dans {Platform.OS === 'ios' ? 'la section Plus' : 'le menu'}.
              </Text>
            </View>
            <View style={[landingStyles.contentContainer, { paddingTop: 0, marginBottom: 30 }]}>
              <Text>
                Si vous souhaitez discuter avec les développeurs et les autres bêta-testeurs, vous
                pouvez rejoindre le canal Telegram.
              </Text>
              <Button
                mode="text"
                color={colors.primary}
                uppercase={false}
                onPress={() => Linking.openURL('https://t.me/joinchat/AAAAAEfRz29dT2eYy9w_7A')}
                style={{ flex: 1, marginTop: 10 }}
              >
                Rejoindre le canal Telegram
              </Button>
            </View>
          </View>
          <View style={{ marginBottom: 20 }}>
            <View style={landingStyles.centerIllustrationContainer}>
              <Illustration name="beta-bugs" height={200} width={200} />
              <Text style={landingStyles.sectionSubtitle}>Bugs et plantages</Text>
            </View>
            <View style={landingStyles.contentContainer}>
              <Text>
                Étant donné que l&apos;application est toujours en bêta, elle peut être instable, et
                vous rencontrerez sûrement des bugs.{'\n'}
              </Text>
              <Text>
                Les rapports de plantage sont envoyés automatiquement, mais pour tout autre problème
                nous vous demandons d&apos;utiliser la fonctionnalité &quot;Feedback&quot; pour nous
                le signaler.
              </Text>
              <Text>
                Topic envoie automatiquement des informations anonymes sur votre interaction avec
                l&apos;application. Vous pouvez désactiver l&apos;envoi depuis les paramètres.
              </Text>
            </View>
          </View>
          <View>
            <View style={landingStyles.centerIllustrationContainer}>
              <Illustration name="beta-updates" height={200} width={200} />

              <Text style={landingStyles.sectionSubtitle}>Mises à jour</Text>
            </View>
            <View style={landingStyles.contentContainer}>
              <Text>
                Nous publierons des mises à jour sur{' '}
                {Platform.OS === 'ios' ? 'Testflight' : 'le Play Store'} toutes les semaines
                environ. N&apos;hésitez pas à regarder les notes de mise à jour pour voir quelles
                fonctionnalités vous pouvez tester.{'\n'}
              </Text>
              <Text>Bon bêta-testing !</Text>
              <View style={landingStyles.centerIllustrationContainer}>
                <View style={{ marginVertical: 10 }}>
                  <TouchableWithoutFeedback onPress={nextChouette}>
                    <Image
                      style={{ height: 200 }}
                      resizeMode="contain"
                      source={chouettes[currentChouette]}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
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
