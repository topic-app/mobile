import React from 'react';
import { View, Platform } from 'react-native';
import { Button, HelperText, List, Text, Checkbox, Divider, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  Account,
  State,
  ArticleCreationData,
  Department,
  School,
  ReduxLocation,
  RequestState,
  GroupRolePermission,
  GroupRole,
} from '@ts/types';
import { StepperViewPageProps, ErrorMessage } from '@components/index';
import { useTheme } from '@utils/index';
import { updateArticleCreationData } from '@redux/actions/contentData/articles';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { fetchMultiDepartment } from '@redux/actions/api/departments';

import getAuthStyles from '../styles/Styles';

type ArticleAddPageLocationProps = StepperViewPageProps & {
  account: Account;
  creationData: ArticleCreationData;
  navigation: any;
  schoolItems: School[];
  departmentItems: Department[];
  locationStates: {
    schools: {
      info: RequestState;
    };
    departments: {
      info: RequestState;
    };
  };
};

const getListItemCheckbox = (props: React.ComponentProps<typeof Checkbox>) => {
  return {
    left:
      Platform.OS !== 'ios'
        ? () => (
            <View style={{ justifyContent: 'center' }}>
              <Checkbox {...props} />
            </View>
          )
        : null,
    right: Platform.OS === 'ios' ? () => <Checkbox {...props} /> : null,
  };
};

const ArticleAddPageLocation: React.FC<ArticleAddPageLocationProps> = ({
  prev,
  next,
  account,
  creationData,
  navigation,
  schoolItems,
  departmentItems,
  locationStates,
}) => {
  const [schools, setSchools] = React.useState<string[]>([]);
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [global, setGlobal] = React.useState(false);
  const [showError, setError] = React.useState(false);

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getAuthStyles(theme);

  const submit = () => {
    if (schools.length !== 0 || departments.length !== 0 || global) {
      updateArticleCreationData({ location: { schools, departments, global } });
      next();
    } else {
      setError(true);
    }
  };

  const selectedGroup = account.groups?.find((g) => g._id === creationData.group);
  const selectedGroupLocation =
    selectedGroup &&
    selectedGroup.roles
      ?.find((r: GroupRole) => r._id === selectedGroup.membership.role)
      ?.permissions.find((p: GroupRolePermission) => p.permission === 'article.add')?.scope;

  const toggle = (i: { _id: string }, func: Function, data: string[]) => {
    if (data.includes(i._id)) {
      func(data.filter((j) => j !== i._id));
    } else {
      setError(false);
      func([...data, i._id]);
    }
  };

  React.useEffect(() => {
    if (selectedGroupLocation?.schools) {
      fetchMultiSchool(selectedGroupLocation.schools.map((s) => s._id));
      fetchMultiDepartment(selectedGroupLocation.departments.map((s) => s._id));
    }
  }, [null]);

  return (
    <View style={articleStyles.formContainer}>
      <View style={articleStyles.listContainer}>
        {selectedGroupLocation?.schools?.map((s) => (
          <List.Item
            title={s.name}
            description={`École · ${s.address?.shortName || s.address?.address?.city}`}
            {...getListItemCheckbox({
              status: schools.includes(s._id) ? 'checked' : 'unchecked',
              color: colors.primary,
              onPress: () => toggle(s, setSchools, schools),
            })}
            onPress={() => toggle(s, setSchools, schools)}
          />
        ))}
        {selectedGroupLocation?.departments?.map((d) => (
          <List.Item
            title={d.name}
            description={`Département ${d.code}`}
            {...getListItemCheckbox({
              status: departments.includes(d._id) ? 'checked' : 'unchecked',
              color: colors.primary,
              onPress: () => toggle(d, setDepartments, departments),
            })}
            onPress={() => toggle(d, setDepartments, departments)}
          />
        ))}
        {(selectedGroupLocation?.global || selectedGroupLocation?.everywhere) && (
          <List.Item
            title="France entière"
            description="Visible pour tous les utilisateurs"
            {...getListItemCheckbox({
              status: global ? 'checked' : 'unchecked',
              color: colors.primary,
              onPress: () => setGlobal(!global),
            })}
            onPress={() => setGlobal(!global)}
          />
        )}
        {selectedGroupLocation?.everywhere ? (
          <View>
            <Divider style={{ marginTop: 20 }} />
            {(locationStates.schools.info.loading || locationStates.departments.info.loading) && (
              <ProgressBar indeterminate />
            )}
            {(locationStates.schools.info.error || locationStates.departments.info.error) && (
              <ErrorMessage
                error={[locationStates.schools.info.error, locationStates.departments.info.error]}
                strings={{
                  what: "l'ajout de l'article",
                  contentSingular: "L'article",
                }}
                type="axios"
                retry={() => {
                  fetchMultiSchool([
                    ...schools,
                    ...selectedGroupLocation.schools.map((s) => s._id),
                  ]);
                  fetchMultiDepartment([
                    ...departments,
                    ...selectedGroupLocation.departments.map((d) => d._id),
                  ]);
                }}
              />
            )}
            <List.Item
              title="Écoles"
              description={
                schools?.length
                  ? schools
                      .map(
                        (s) =>
                          schoolItems?.find((t) => t._id === s)?.displayName ||
                          schoolItems?.find((t) => t._id === s)?.name,
                      )
                      .join(', ')
                  : undefined
              }
              style={{ marginBottom: -20 }}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() =>
                navigation.navigate('Location', {
                  type: 'schools',
                  initialData: { schools, departments, global },
                  callback: ({ schools: newSchools }: ReduxLocation) => {
                    fetchMultiSchool(newSchools);
                    setSchools(newSchools);
                  },
                })
              }
            />
            <List.Item
              title="Départements"
              description={
                departments
                  ?.map((d) =>
                    departmentItems
                      .filter((e) => e.type === 'departement')
                      ?.find((e) => e._id === d),
                  )
                  .filter((d) => d)?.length
                  ? departments
                      .map(
                        (d) =>
                          departmentItems
                            .filter((e) => e.type === 'departement')
                            ?.find((e) => e._id === d)?.displayName ||
                          departmentItems
                            .filter((e) => e.type === 'departement')
                            ?.find((e) => e._id === d)?.name,
                      )
                      .filter((d) => d)
                      .join(', ')
                  : undefined
              }
              style={{ marginBottom: -20 }}
              onPress={() =>
                navigation.navigate('Location', {
                  type: 'departements',
                  initialData: { schools, departments, global },
                  callback: ({ departments: newDepartments }: ReduxLocation) => {
                    fetchMultiDepartment(newDepartments);
                    setDepartments(newDepartments);
                  },
                })
              }
              right={() => <List.Icon icon="chevron-right" />}
            />
            <List.Item
              title="Régions"
              description={
                departments
                  ?.map((d) =>
                    departmentItems.filter((e) => e.type === 'region')?.find((e) => e._id === d),
                  )
                  .filter((d) => d)?.length
                  ? departments
                      .map(
                        (d) =>
                          departmentItems
                            .filter((e) => e.type === 'region')
                            ?.find((e) => e._id === d)?.displayName ||
                          departmentItems
                            .filter((e) => e.type === 'region')
                            ?.find((e) => e._id === d)?.name,
                      )
                      .filter((d) => d)
                      .join(', ')
                  : undefined
              }
              onPress={() =>
                navigation.navigate('Location', {
                  type: 'regions',
                  initialData: { schools, departments, global },
                  callback: ({ departments: newDepartments }: ReduxLocation) => {
                    fetchMultiDepartment(newDepartments);
                    setDepartments(newDepartments);
                  },
                })
              }
              right={() => <List.Icon icon="chevron-right" />}
            />
          </View>
        ) : (
          <Text>Vous pouvez publier seulement dans ces localisations</Text>
        )}
        <HelperText visible={showError} type="error">
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
  const { account, articleData, schools, departments } = state;
  return {
    account,
    creationData: articleData.creationData,
    schoolItems: schools.items,
    departmentItems: departments.items,
    locationStates: {
      schools: schools.state,
      departments: departments.state,
    },
  };
};

export default connect(mapStateToProps)(ArticleAddPageLocation);
