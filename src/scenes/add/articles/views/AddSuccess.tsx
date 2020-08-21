import React from 'react';
import { connect } from 'react-redux';
import { Platform, View, Alert, ScrollView, Clipboard, Share } from 'react-native';
import { Text, Button, Divider, Snackbar, useTheme, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { State, ArticleRequestState, Account } from '@ts/types';
import { Illustration, ArticleCard, ErrorMessage, TranslucentStatusBar } from '@components/index';
import { articleVerificationApprove } from '@redux/actions/apiActions/articles';
import getStyles from '@styles/Styles';

import type { AuthStackParams } from '../index';
import getAuthStyles from '../styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  navigation: StackNavigationProp<AuthStackParams, 'CreateSuccess'>;
  reqState: ArticleRequestState;
  account: Account;
  route: {
    params: {
      id: string;
      creationData: {
        title: string;
        summary: string;
        image: {
          image: string;
        };
        group: string;
        data: string;
      };
    };
  };
};

const ArticleAddSuccess: React.FC<Props> = ({ navigation, reqState, account, route }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const authStyles = getAuthStyles(theme);
  const { colors } = theme;

  const [approved, setApproved] = React.useState(false);

  const { id, creationData } = route?.params || {};

  let groupName = account?.groups?.find((g) => g._id === creationData?.group)?.name;

  const approve = () => {
    articleVerificationApprove(id).then(() => setApproved(true));
  };

  return (
    <View style={styles.page}>
      {reqState.verification_approve?.success === false && (
        <SafeAreaView>
          <ErrorMessage
            error={reqState.verification_approve?.error}
            strings={{
              what: "l'approbation de l'article",
              contentSingular: "L'article",
            }}
            type="axios"
            retry={approve}
          />
        </SafeAreaView>
      )}
      <ScrollView>
        <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
          <Illustration name="auth-register-success" height={200} width={200} />
          <Text style={authStyles.title}>
            Article {approved ? 'publié' : 'en attente de modération'}
          </Text>
          {!approved && (
            <View>
              <Text style={{ marginTop: 40 }}>
                Votre article doit être approuvé par un administrateur de {groupName}.
              </Text>
              <Text>Vous serez notifiés par email dès que l'article est approuvé.</Text>
            </View>
          )}
          {account.permissions?.some(
            (p) =>
              p.name === 'article.verification.approve' &&
              (p.scope?.groups?.includes(creationData?.group) ||
                (p.group === creationData?.group && p.scope?.self)),
          ) &&
            (approved ? (
              <Text>Article approuvé par @{account?.accountInfo?.user?.info?.username}</Text>
            ) : (
              <View>
                <Text style={{ marginTop: 30 }}>Vous pouvez approuver vous même cet article</Text>
                <Button
                  uppercase={Platform.OS !== 'ios'}
                  loading={reqState.verification_approve?.loading}
                  mode="outlined"
                  style={{ marginTop: 10 }}
                  onPress={() => {
                    Alert.alert(
                      "Approuver l'article?",
                      "L'article doit ềtre conforme aux conditions d'utilisation.\nVous êtes responsables si l'article ne les respecte pas, et nous pouvons désactiver votre compte si c'est le cas.\n\nDe plus, nous vous conseillons d'attendre l'approbation d'un autre membre, afin d'éviter les erreurs",
                      [
                        {
                          text: 'Annuler',
                        },
                        {
                          text: 'Approuver',
                          onPress: approve,
                        },
                      ],
                      { cancelable: true },
                    );
                  }}
                >
                  {reqState.verification_approve?.loading ? '' : 'Approuver'}
                </Button>
              </View>
            ))}
        </View>
        <View style={{ marginBottom: 30 }}>
          <View style={[styles.container, { marginTop: 20 }]}>
            <Text style={{ color: colors.disabled, marginBottom: 5, marginLeft: 10 }}>
              Lien de partage
            </Text>
            <Card
              elevation={0}
              style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
            >
              <View style={[styles.container, { flexDirection: 'row' }]}>
                <ScrollView horizontal>
                  <Text style={{ color: colors.text, fontSize: 20 }} numberOfLines={1}>
                    https://go.topicapp.fr/articles/{id}
                  </Text>
                </ScrollView>
                <Icon
                  name="content-copy"
                  style={{ alignSelf: 'center', marginLeft: 10 }}
                  size={24}
                  color={colors.text}
                  onPress={() => {
                    Clipboard.setString(`https://go.topicapp.fr/articles/${id}`);
                    Alert.alert(
                      'Lien copié',
                      "Vous ne pourrez pas utiliser ce lien tant que l'article n'aura pas été validé.",
                      [{ text: 'Fermer' }],
                      { cancelable: true },
                    );
                  }}
                />
                <Icon
                  name="share-variant"
                  style={{ alignSelf: 'center', marginLeft: 10 }}
                  size={24}
                  color={colors.text}
                  onPress={() => {
                    Alert.alert(
                      "Partager l'article",
                      "L'article ne sera pas accessible tant qu'il n'a pas été approuvé",
                      [
                        { text: 'Annuler' },
                        {
                          text: 'Partager',
                          onPress:
                            Platform.OS === 'ios'
                              ? () =>
                                  Share.share({
                                    message: `${creationData?.title} par ${groupName}`,
                                    url: `https://go.topicapp.fr/articles/${id}`,
                                  })
                              : () =>
                                  Share.share({
                                    message: `https://go.topicapp.fr/articles/${id}`,
                                    title: `${creationData?.title} par ${groupName}`,
                                  }),
                        },
                      ],
                    );
                  }}
                />
              </View>
            </Card>
          </View>
          <ArticleCard
            article={{
              ...creationData,
              summary: creationData.summary || creationData.data,
              authors: [
                {
                  displayName: account?.accountInfo?.user?.info?.username,
                },
              ],
              group: {
                displayName: account?.groups?.find((g) => g._id === creationData?.group)?.name,
              },
            }}
            navigate={() => null}
            unread
          />
        </View>
      </ScrollView>
      <Divider />
      <View style={authStyles.formContainer}>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'Home1',
                params: { screen: 'Home2', params: { screen: 'Article' } },
              })
            }
            style={{ flex: 1 }}
          >
            Continuer
          </Button>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, articles } = state;
  return { account, reqState: articles.state };
};

export default connect(mapStateToProps)(ArticleAddSuccess);