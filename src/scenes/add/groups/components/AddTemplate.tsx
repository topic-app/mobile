import React from 'react';
import { View, Platform } from 'react-native';
import {
  Button,
  RadioButton,
  HelperText,
  List,
  Text,
  useTheme,
  Card,
  ProgressBar,
  Divider,
  Title,
} from 'react-native-paper';

import { updateGroupCreationData } from '@redux/actions/contentData/groups';
import { updateGroupTemplates } from '@redux/actions/api/groups';
import { StepperViewPageProps, ErrorMessage, Content, CollapsibleView } from '@components/index';
import { Account, State, GroupTemplate, GroupsState, GroupRequestState } from '@ts/types';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getAuthStyles from '../styles/Styles';
import { connect } from 'react-redux';

type Props = StepperViewPageProps & {
  account: Account;
  templates: GroupTemplate[];
  state: GroupRequestState;
};

const ArticleAddPageGroup: React.FC<Props> = ({ next, account, templates, state }) => {
  const [template, setTemplate] = React.useState<string | null>(null);
  const [showError, setError] = React.useState(false);

  const submit = () => {
    if (template) {
      updateGroupCreationData({ type: template });
      next();
    } else {
      setError(true);
    }
  };

  React.useEffect(() => {
    updateGroupTemplates();
  }, []);

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

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
    <View style={articleStyles.formContainer}>
      {state.templates?.loading?.initial ? (
        <ProgressBar indeterminate />
      ) : (
        <View style={{ height: 4 }} />
      )}
      {state.templates?.success === false && (
        <ErrorMessage
          error={state.templates?.error}
          strings={{
            what: 'la récupération des types de groups',
            contentPlural: 'Les types de groups',
          }}
          type="axios"
          retry={updateGroupTemplates}
        />
      )}
      <View style={articleStyles.listContainer}>
        {templates?.map((t) => (
          <List.Item
            key={t.type}
            title={t.name}
            description={t.summary}
            left={() =>
              Platform.OS !== 'ios' ? (
                <View style={{ justifyContent: 'center' }}>
                  <RadioButton
                    status={template === t.type ? 'checked' : 'unchecked'}
                    color={colors.primary}
                    onPress={() => {
                      setError(false);
                      setTemplate(t.type);
                    }}
                  />
                </View>
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <View style={{ justifyContent: 'center' }}>
                  <RadioButton
                    status={template === t.type ? 'checked' : 'unchecked'}
                    color={colors.primary}
                    onPress={() => {
                      setError(false);
                      setTemplate(t.type);
                    }}
                  />
                </View>
              ) : null
            }
            onPress={() => {
              setError(false);
              setTemplate(t.type);
            }}
          />
        ))}
        <HelperText visible={showError} type="error">
          Vous devez selectionner un type de groupe
        </HelperText>
      </View>
      <View style={articleStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => submit()}
          style={{ flex: 1 }}
        >
          Suivant
        </Button>
      </View>
      <View style={[styles.container, { marginTop: 60 }]}>
        <CollapsibleView collapsed={!template}>
          <View>
            <Divider style={{ marginBottom: 10 }} />
            <Title style={{ marginBottom: 20 }}>
              Groupe {templates.find((t) => t.type === template)?.name}
            </Title>
            <Content
              parser="markdown"
              data={templates.find((t) => t.type === template)?.description || ''}
            />
          </View>
        </CollapsibleView>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, groups } = state;
  return { account, templates: groups.templates, state: groups.state };
};

export default connect(mapStateToProps)(ArticleAddPageGroup);
