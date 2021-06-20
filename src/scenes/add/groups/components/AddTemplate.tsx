import React from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import { HelperText, Button, RadioButton, Text, List, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { StepperViewPageProps, ErrorMessage } from '@components';
import { updateGroupTemplates } from '@redux/actions/api/groups';
import { updateGroupCreationData } from '@redux/actions/contentData/groups';
import { GroupTemplate, GroupRequestState } from '@ts/types';

import getStyles from '../styles';

type Props = StepperViewPageProps & { templates: GroupTemplate[]; state: GroupRequestState };

const ArticleAddPageTemplate: React.FC<Props> = ({ next, prev, templates, state }) => {
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
  const styles = getStyles(theme);

  return (
    <View style={styles.formContainer}>
      <View style={[styles.container, { marginTop: 40 }]}>
        <Card
          elevation={0}
          style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
        >
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <Icon
              name="shield-key-outline"
              style={{ alignSelf: 'center', marginRight: 10 }}
              size={24}
              color={colors.primary}
            />
            <Text style={{ color: colors.text, flex: 1 }}>
              Assurez-vous que vous avez bien l&apos;autorisation de créer ce groupe. Nous pourrons
              vous demander des preuves d&apos;autorité si nécessaire.
            </Text>
          </View>
        </Card>
      </View>
      {state.templates?.loading?.initial ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <View style={{ height: 4 }} />
      )}
      {state.templates?.error && (
        <ErrorMessage
          error={state.templates?.error}
          strings={{
            what: 'la récupération des types de groupes',
            contentPlural: 'Les types de groupes',
          }}
          type="axios"
          retry={updateGroupTemplates}
        />
      )}
      <View style={styles.listContainer}>
        {templates?.map((t) => (
          <List.Item
            key={t.type}
            title={t.name}
            description={t.summary}
            left={() =>
              Platform.OS !== 'ios' ? (
                <View style={{ justifyContent: 'center' }}>
                  <RadioButton
                    value=""
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
                    value=""
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
          Vous devez sélectionner un type de groupe
        </HelperText>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={submit}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

export default ArticleAddPageTemplate;
