import React from 'react';
import { View, Platform, Alert } from 'react-native';
import {
  Button,
  RadioButton,
  HelperText,
  List,
  Text,
  useTheme,
  Divider,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { StepperViewPageProps } from '@components';
import {
  clearArticleCreationData,
  updateArticleCreationData,
} from '@redux/actions/contentData/articles';
import { Account, ArticleCreationData, State } from '@ts/types';
import { checkPermission, trackEvent, Permissions } from '@utils';

import getStyles from '../styles';

type ArticleAddPageGroupProps = StepperViewPageProps & {
  account: Account;
  creationData: ArticleCreationData;
};

const ArticleAddPageGroup: React.FC<ArticleAddPageGroupProps> = ({
  next,
  account,
  creationData,
}) => {
  const [group, setGroup] = React.useState<string | null>(null);
  const [showError, setError] = React.useState(false);
  const theme = useTheme();

  const submitDraft = () => {
    trackEvent('articleadd:page-location');
    next();
  };

  const submitNew = async (showAlert = false) => {
    if (showAlert) {
      Alert.alert(
        'Supprimer le brouillon précédent ?',
        `En créant un nouvel article, vous supprimerez le brouillon de "${creationData.title}"`,
        [{ text: 'Annuler' }, { text: 'Continuer', onPress: () => submitNew() }],
        { cancelable: true },
      );
    } else if (group !== null) {
      trackEvent('articleadd:page-location');
      await clearArticleCreationData();
      await updateArticleCreationData({ group });
      next();
    } else {
      setError(true);
    }
  };

  const { colors } = theme;
  const styles = getStyles(theme);
  const groupsWithPermission = account.groups?.filter((g) =>
    checkPermission(
      account,
      {
        permission: Permissions.ARTICLE_ADD,
        scope: {},
      },
      g._id,
    ),
  );

  if (!account.loggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.centerIllustrationContainer}>
          <Text>Non autorisé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.formContainer}>
      <View style={styles.listContainer}>
        {groupsWithPermission?.map((g) => (
          <List.Item
            key={g._id}
            title={g.name}
            description={`Groupe ${g.type} · Vous êtes ${
              g.roles.find((r) => r._id === g.membership.role)?.name
            }`}
            left={() =>
              Platform.OS !== 'ios' ? (
                <View style={{ justifyContent: 'center' }}>
                  <RadioButton
                    value=""
                    status={group === g._id ? 'checked' : 'unchecked'}
                    color={colors.primary}
                    onPress={() => {
                      setError(false);
                      setGroup(g._id);
                    }}
                  />
                </View>
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <View style={{ justifyContent: 'center' }}>
                  <RadioButton
                    value=""
                    status={group === g._id ? 'checked' : 'unchecked'}
                    color={colors.primary}
                    onPress={() => {
                      setError(false);
                      setGroup(g._id);
                    }}
                  />
                </View>
              ) : null
            }
            onPress={() => {
              setError(false);
              setGroup(g._id);
            }}
          />
        ))}
        <HelperText visible={showError} type="error">
          Vous devez sélectionner un groupe
        </HelperText>
        {groupsWithPermission?.length !== account.groups?.length && (
          <Text>
            Certains groupes n&apos;apparaissent pas car vous ne pouvez pas écrire d&apos;articles
            pour ces groupes
          </Text>
        )}
      </View>
      {!(creationData.title && creationData.group) ? (
        <View style={styles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => submitNew(false)}
            style={{ flex: 1 }}
          >
            Suivant
          </Button>
        </View>
      ) : (
        <View>
          <View style={styles.buttonContainer}>
            <Button
              mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
              uppercase={Platform.OS !== 'ios'}
              onPress={() => submitNew(true)}
              style={{ flex: 1 }}
            >
              Nouvel article
            </Button>
          </View>
          <Divider style={{ marginTop: 60 }} />
          <View style={{ marginVertical: 20 }}>
            <Card
              elevation={0}
              style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
              onPress={submitDraft}
            >
              <View style={[styles.container, { flexDirection: 'row', alignItems: 'center' }]}>
                <Icon name="file-document-edit-outline" color={colors.text} size={24} />
                <View style={{ marginLeft: 10 }}>
                  <Text>{creationData.title}</Text>
                  <Text style={{ fontSize: 14, color: colors.muted }}>
                    Brouillon -{' '}
                    {groupsWithPermission.find((g) => g._id === creationData.group)?.displayName ||
                      'Groupe inconnu'}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
              uppercase={Platform.OS !== 'ios'}
              onPress={submitDraft}
              style={{ flex: 1 }}
            >
              Reprendre
            </Button>
          </View>
        </View>
      )}
      {/* Platform.OS !== 'web' && (
        <View style={[styles.container, { marginTop: 40 }]}>
          <Card
            elevation={0}
            style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
          >
            <View style={[styles.container, { flexDirection: 'row' }]}>
              <Icon
                name="information"
                style={{ alignSelf: 'center', marginRight: 10 }}
                size={24}
                color={colors.primary}
              />
              <Text style={{ color: colors.primary, flex: 1 }}>
                Vous pouvez écrire un article depuis votre ordinateur en visitant topicapp.fr
              </Text>
            </View>
          </Card>
        </View>
      ) */}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, articleData } = state;
  return { account, creationData: articleData.creationData };
};

export default connect(mapStateToProps)(ArticleAddPageGroup);
