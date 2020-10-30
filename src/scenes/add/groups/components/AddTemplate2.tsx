import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import {
  TextInput,
  HelperText,
  Button,
  useTheme,
  ProgressBar,
  RadioButton,
  List,
} from 'react-native-paper';

import { StepperViewPageProps, CollapsibleView, ErrorMessage } from '@components/index';
import { updateGroupTemplates } from '@redux/actions/api/groups';
import { updateGroupCreationData } from '@redux/actions/contentData/groups';
import { GroupTemplate, GroupRequestState, State } from '@ts/types';

import getStyles from '@styles/Styles';
import getGroupStyles from '../styles/Styles';
import { connect } from 'react-redux';

type Props = StepperViewPageProps & { templates: GroupTemplate[]; state: GroupRequestState };

const ArticleAddPageTemplate: React.FC<Props> = ({ next, prev, templates, state }) => {
  const [template, setTemplate] = React.useState<string | null>(null);
  const [showError, setError] = React.useState(false);

  const submit = () => {
    if (template) {
      updateGroupCreationData({ type: template });
      console.log('hello');
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
  const groupStyles = getGroupStyles(theme);
  const styles = getStyles(theme);

  return (
    <View style={groupStyles.formContainer}>
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
      <View style={groupStyles.listContainer}>
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
      <View style={groupStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => prev()}
          style={{ flex: 1, marginRight: 5 }}
        >
          Retour
        </Button>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => {
            submit();
          }}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

export default ArticleAddPageTemplate;
