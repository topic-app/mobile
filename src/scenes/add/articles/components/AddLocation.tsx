import React from 'react';
import { View, Platform } from 'react-native';
import { Button, HelperText, List, Text, Checkbox, Divider, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { StepperViewPageProps, ErrorMessage } from '@components/index';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { updateArticleCreationData } from '@redux/actions/contentData/articles';
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
import { trackEvent, useTheme } from '@utils/index';

import { CheckboxListItem } from '../../components/ListItems';
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
        : undefined,
    right: Platform.OS === 'ios' ? () => <Checkbox {...props} /> : undefined,
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
      trackEvent('articleadd:page-meta');
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
      fetchMultiSchool(selectedGroupLocation.schools || []);
      fetchMultiDepartment(selectedGroupLocation.departments || []);
    }
  }, [null]);

  return (
    <View style={articleStyles.formContainer}>
      <View style={articleStyles.listContainer}>
        {selectedGroupLocation?.schools?.map((sId) => {
          const s = schoolItems.find((t) => t._id === sId);
          if (!s) return null;
          return (
            <CheckboxListItem
              key={s._id}
              title={s.name}
              description={`École · ${s.address?.shortName || s.address?.address?.city}`}
              status={schools.includes(s._id) ? 'checked' : 'unchecked'}
              onPress={() => toggle(s, setSchools, schools)}
            />
          );
        })}
        {selectedGroupLocation?.departments?.map((dId) => {
          const d = departmentItems.find((t) => t._id === dId);
          if (!d) return null;
          return (
            <CheckboxListItem
              key={d._id}
              title={d.name}
              description={`Département ${d.code}`}
              status={departments.includes(d._id) ? 'checked' : 'unchecked'}
              onPress={() => toggle(d, setDepartments, departments)}
            />
          );
        })}
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
                  what: 'la recherche des localisations',
                  contentSingular: 'La liste de localisations',
                  contentPlural: 'Les localisations',
                }}
                type="axios"
                retry={() => {
                  fetchMultiSchool([...schools, ...(selectedGroupLocation.schools || [])]);
                  fetchMultiDepartment([
                    ...departments,
                    ...(selectedGroupLocation.departments || []),
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
                navigation.push('Root', {
                  screen: 'Main',
                  params: {
                    screen: 'More',
                    params: {
                      screen: 'Location',
                      params: {
                        type: 'schools',
                        subtitle: 'Écrire un article',
                        initialData: { schools, departments, global },
                        callback: ({ schools: newSchools }: ReduxLocation) => {
                          fetchMultiSchool(newSchools);
                          setSchools(newSchools);
                        },
                      },
                    },
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
                navigation.push('Root', {
                  screen: 'Main',
                  params: {
                    screen: 'More',
                    params: {
                      screen: 'Location',
                      params: {
                        type: 'departements',
                        subtitle: 'Écrire un article',
                        initialData: { schools, departments, global },
                        callback: ({ departments: newDepartments }: ReduxLocation) => {
                          fetchMultiDepartment(newDepartments);
                          setDepartments(newDepartments);
                        },
                      },
                    },
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
                navigation.push('Root', {
                  screen: 'Main',
                  params: {
                    screen: 'More',
                    params: {
                      screen: 'Location',
                      params: {
                        type: 'regions',
                        subtitle: 'Écrire un article',
                        initialData: { schools, departments, global },
                        callback: ({ departments: newDepartments }: ReduxLocation) => {
                          fetchMultiDepartment(newDepartments);
                          setDepartments(newDepartments);
                        },
                      },
                    },
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
          Vous devez sélectionner au moins une localisation
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
