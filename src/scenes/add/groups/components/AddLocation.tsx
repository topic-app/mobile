import React from 'react';
import { View, Platform } from 'react-native';
import { Button, HelperText, List, Card, Text, Divider, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { StepperViewPageProps, ErrorMessage } from '@components/index';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { updateGroupCreationData } from '@redux/actions/contentData/groups';
import getStyles from '@styles/Styles';
import {
  Account,
  State,
  ArticleCreationData,
  Department,
  School,
  RequestState,
  ReduxLocation,
  LocationList,
} from '@ts/types';
import { useTheme } from '@utils/index';

import { CheckboxListItem } from '../../components/ListItems';
import type { GroupAddScreenNavigationProp } from '../index';
import getAuthStyles from '../styles/Styles';

type GroupAddLocationProps = StepperViewPageProps & {
  navigation: GroupAddScreenNavigationProp<'Add'>;
  account: Account;
  creationData: ArticleCreationData;
  location: LocationList;
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

const GroupAddLocation: React.FC<GroupAddLocationProps> = ({
  prev,
  next,
  account,
  location,
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

  const submit = () => {
    if (schools.length !== 0 || departments.length !== 0 || global) {
      updateGroupCreationData({ location: { schools, departments, global } });
      next();
    } else {
      setError(true);
    }
  };

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const toggle = (i: { _id: string }, data: string[], func: Function) => {
    if (data.includes(i._id)) {
      func(data.filter((j) => j !== i._id));
    } else {
      setError(false);
      func([...data, i._id]);
    }
  };

  return (
    <View style={articleStyles.formContainer}>
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
            <Text style={{ color: colors.text, flex: 1 }}>
              Vous pourrez publier des contenus dans ces localisations. Séléctionnez uniquement
              celles qui correspondent à votre champ d&apos;action.
            </Text>
          </View>
        </Card>
      </View>
      <View style={articleStyles.listContainer}>
        {location.schoolData?.map((s) => (
          <CheckboxListItem
            key={s._id}
            title={s.name}
            description={`École · ${s.address?.shortName || s.address?.address?.city}`}
            status={schools.includes(s._id) ? 'checked' : 'unchecked'}
            onPress={() => toggle(s, schools, setSchools)}
          />
        ))}
        {location.departmentData?.map((d) => (
          <CheckboxListItem
            key={d._id}
            title={d.name}
            description={`Département ${d.code}`}
            status={departments.includes(d._id) ? 'checked' : 'unchecked'}
            onPress={() => toggle(d, departments, setDepartments)}
          />
        ))}
        <CheckboxListItem
          title="France entière"
          description="Visible pour tous les utilisateurs"
          status={global ? 'checked' : 'unchecked'}
          onPress={() => setGlobal(!global)}
        />
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
                fetchMultiSchool([...schools, ...location.schools]);
                fetchMultiDepartment([...departments, ...location.departments]);
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
                        location.schoolData?.find((t) => t._id === s)?.displayName ||
                        schoolItems?.find((t) => t._id === s)?.name ||
                        location.schoolData?.find((t) => t._id === s)?.name,
                    )
                    .join(', ')
                : undefined
            }
            style={{ marginBottom: -20 }}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() =>
              navigation.navigate('Location', {
                type: 'schools',
                hideSearch: false,
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
                  departmentItems.filter((e) => e.type === 'departement')?.find((e) => e._id === d),
                )
                .filter((d) => d)?.length
                ? departments
                    .map(
                      (d) =>
                        departmentItems
                          .filter((e) => e.type === 'departement')
                          ?.find((e) => e._id === d)?.displayName ||
                        location.departmentData
                          .filter((e) => e.type === 'departement')
                          ?.find((e) => e._id === d)?.displayName ||
                        departmentItems
                          .filter((e) => e.type === 'departement')
                          ?.find((e) => e._id === d)?.name ||
                        location.departmentData
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
                hideSearch: false,
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
                        departmentItems.filter((e) => e.type === 'region')?.find((e) => e._id === d)
                          ?.displayName ||
                        departmentItems.filter((e) => e.type === 'region')?.find((e) => e._id === d)
                          ?.name,
                    )
                    .filter((d) => d)
                    .join(', ')
                : undefined
            }
            onPress={() =>
              navigation.navigate('Location', {
                type: 'regions',
                hideSearch: false,
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
  const { account, location, groupData, schools, departments } = state;
  return {
    account,
    location,
    creationData: groupData.creationData,
    schoolItems: schools.items,
    departmentItems: departments.items,
    locationStates: {
      schools: schools.state,
      departments: departments.state,
    },
  };
};

export default connect(mapStateToProps)(GroupAddLocation);
