import React from 'react';
import { View, Platform } from 'react-native';
import { Button, HelperText, List, Text, Divider, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { StepperViewPageProps, ErrorMessage, FullscreenIllustration } from '@components/index';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import {
  Account,
  State,
  EventCreationData,
  Department,
  School,
  ReduxLocation,
  RequestState,
} from '@ts/types';
import { useTheme } from '@utils/index';

import { CheckboxListItem } from '../../components/ListItems';
import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  account: Account;
  creationData: EventCreationData;
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

const EventAddPageLocation: React.FC<Props> = ({
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

  const submit = () => {
    if (schools.length !== 0 || departments.length !== 0 || global) {
      updateEventCreationData({ location: { schools, departments, global } });
      next();
    } else {
      setError(true);
    }
  };

  const theme = useTheme();
  const eventStyles = getAuthStyles(theme);

  const selectedGroup = account.groups.find((g) => g._id === creationData.group);
  const selectedGroupLocation = selectedGroup?.roles
    ?.find((r) => r._id === selectedGroup?.membership.role)
    ?.permissions.find((p) => p.permission === 'event.add')?.scope;

  React.useEffect(() => {
    if (selectedGroupLocation) {
      fetchMultiSchool(selectedGroupLocation.schools || []);
      fetchMultiDepartment(selectedGroupLocation.departments || []);
    }
  }, [null]);

  if (!selectedGroupLocation) {
    return (
      <FullscreenIllustration
        illustration="empty"
        buttonLabel="Retour"
        buttonOnPress={() => prev()}
      >
        Groupe Introuvable, essayez de reséléctionner un groupe dont vous appartenez
      </FullscreenIllustration>
    );
  }

  const toggle = (i: { _id: string }, data: string[], func: (arr: string[]) => void) => {
    if (data.includes(i._id)) {
      func(data.filter((j) => j !== i._id));
    } else {
      setError(false);
      func([...data, i._id]);
    }
  };

  return (
    <View style={eventStyles.formContainer}>
      <View style={eventStyles.listContainer}>
        {selectedGroupLocation.schools?.map((sId) => {
          const s = schoolItems.find((t) => t._id === sId);
          if (!s) return null;
          return (
            <CheckboxListItem
              key={s._id}
              title={s.name}
              description={`École · ${s.address?.shortName || s.address?.address?.city}`}
              status={schools.includes(s._id) ? 'checked' : 'unchecked'}
              onPress={() => toggle(s, schools, setSchools)}
            />
          );
        })}
        {selectedGroupLocation.departments?.map((dId) => {
          const d = departmentItems.find((t) => t._id === dId);
          if (!d) return null;
          return (
            <CheckboxListItem
              key={d._id}
              title={d.name}
              description={`Département ${d.code}`}
              status={departments.includes(d._id) ? 'checked' : 'unchecked'}
              onPress={() => toggle(d, departments, setDepartments)}
            />
          );
        })}
        {selectedGroupLocation.global ||
          (selectedGroupLocation.everywhere && (
            <CheckboxListItem
              title="France entière"
              description="Visible pour tous les utilisateurs"
              status={global ? 'checked' : 'unchecked'}
              onPress={() => setGlobal(!global)}
            />
          ))}
        {selectedGroupLocation.everywhere ? (
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
      <View style={eventStyles.buttonContainer}>
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
  const { account, eventData, schools, departments } = state;
  return {
    account,
    creationData: eventData.creationData,
    schoolItems: schools.items,
    departmentItems: departments.items,
    locationStates: {
      schools: schools.state,
      departments: departments.state,
    },
  };
};

export default connect(mapStateToProps)(EventAddPageLocation);
