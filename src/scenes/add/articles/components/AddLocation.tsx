import React from 'react';
import { View, Platform } from 'react-native';
import {
  Button,
  RadioButton,
  HelperText,
  List,
  Text,
  Checkbox,
  useTheme,
  Divider,
} from 'react-native-paper';

import { updateArticleCreationData } from '@redux/actions/contentData/articles';
import { StepperViewPageProps } from '@components/index';
import { Account, State, ArticleCreationData } from '@ts/types';
import getStyles from '@styles/Styles';

import getAuthStyles from '../styles/Styles';
import { connect } from 'react-redux';

type Props = StepperViewPageProps & { account: Account; creationData: ArticleCreationData };

const ArticleAddPageGroup: React.FC<Props> = ({ prev, next, account, creationData }) => {
  const [schools, setSchools] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [global, setGlobal] = React.useState(false);
  const [showError, setError] = React.useState(false);

  const submit = () => {
    if (schools.length !== 0 || departments.length !== 0 || global) {
      updateArticleCreationData({ location: { schools, departments, global } });
      next();
    } else {
      setError(true);
    }
  };

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const selectedGroup = account.groups.find((g) => g._id === creationData.group);
  const selectedGroupLocation =
    selectedGroup &&
    selectedGroup.roles
      ?.find((r) => r._id === selectedGroup.membership.role)
      ?.permissions.find((p) => p.permission === 'article.add')?.scope;

  const toggle = (i: { _id: string }, func: Function, data: string[]) => {
    if (data.includes(i._id)) {
      func(data.filter((j) => j !== i._id));
    } else {
      setError(false);
      setSchools([...data, i._id]);
    }
  };

  return (
    <View style={articleStyles.formContainer}>
      <View style={articleStyles.listContainer}>
        {selectedGroupLocation?.schools?.map((s) => (
          <List.Item
            title={s.name}
            description={`École · ${s.address?.shortName || s.address?.address?.city}`}
            left={() =>
              Platform.OS !== 'ios' ? (
                <Checkbox
                  status={schools.includes(s._id) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  onPress={() => toggle(s, schools, setSchools)}
                />
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <Checkbox
                  status={schools.includes(s._id) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  onPress={() => toggle(s, schools, setSchools)}
                />
              ) : null
            }
            onPress={() => toggle(s, schools, setSchools)}
          />
        ))}
        {selectedGroupLocation?.departments?.map((d) => (
          <List.Item
            title={d.name}
            description={`Département ${d.code}`}
            left={() =>
              Platform.OS !== 'ios' ? (
                <Checkbox
                  status={departments.includes(d._id) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  onPress={() => toggle(d, departments, setDepartments)}
                />
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <Checkbox
                  status={schools.includes(d._id) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  onPress={() => toggle(d, departments, setDepartments)}
                />
              ) : null
            }
            onPress={() => toggle(d, departments, setDepartments)}
          />
        ))}
        {selectedGroupLocation?.global ||
          (selectedGroupLocation?.everywhere && (
            <List.Item
              title="France entière"
              description="Visible pour tous les utilisateurs"
              left={() =>
                Platform.OS !== 'ios' ? (
                  <Checkbox
                    status={global ? 'checked' : 'unchecked'}
                    color={colors.primary}
                    onPress={() => setGlobal(!global)}
                  />
                ) : null
              }
              right={() =>
                Platform.OS === 'ios' ? (
                  <Checkbox
                    status={global ? 'checked' : 'unchecked'}
                    color={colors.primary}
                    onPress={() => setGlobal(!global)}
                  />
                ) : null
              }
              onPress={() => setGlobal(!global)}
            />
          ))}
        {selectedGroupLocation?.everywhere ? (
          <View>
            <Divider style={{ marginTop: 20 }} />
            <List.Item
              title="Toutes les écoles"
              style={{ marginBottom: -20 }}
              right={() => <List.Icon icon="chevron-right" />}
            />
            <List.Item
              title="Tous les départements"
              style={{ marginBottom: -20 }}
              right={() => <List.Icon icon="chevron-right" />}
            />
            <List.Item
              title="Toutes les régions"
              right={() => <List.Icon icon="chevron-right" />}
            />
          </View>
        ) : (
          <Text>Vous pouvez publier seulement dans ces localisations</Text>
        )}
        <HelperText visible={showError}>
          Vous devez selectionner au moins une localisation
        </HelperText>
      </View>
      <View style={articleStyles.buttonContainer}>
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
          onPress={submit}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, articleData } = state;
  return { account, creationData: articleData.creationData };
};

export default connect(mapStateToProps)(ArticleAddPageGroup);
