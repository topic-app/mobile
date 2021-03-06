import _ from 'lodash';
import React from 'react';
import { View, Platform } from 'react-native';
import {
  Button,
  HelperText,
  List,
  Card,
  Text,
  Divider,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { StepperViewPageProps, ErrorMessage } from '@components';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { updateGroupCreationData } from '@redux/actions/contentData/groups';
import {
  State,
  Department,
  School,
  RequestState,
  ReduxLocation,
  LocationList,
  AnySchool,
  AnyDepartment,
} from '@ts/types';
import { Format } from '@utils';

import { CheckboxListItem } from '../../components/ListItems';
import type { GroupAddScreenNavigationProp } from '../index';
import getStyles from '../styles';

type GroupAddLocationProps = StepperViewPageProps & {
  navigation: GroupAddScreenNavigationProp<'Add'>;
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
  location,
  navigation,
  schoolItems,
  departmentItems,
  locationStates,
}) => {
  const [schools, setSchools] = React.useState<string[]>([]);
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [isGlobal, setGlobal] = React.useState(false);
  const [showError, setError] = React.useState(false);

  // Merge schools and departments but remove all duplicate elements
  const selectedSchools = _.uniqBy([...schoolItems, ...location.schoolData], '_id').filter((sch) =>
    schools.includes(sch._id),
  );

  const selectedDepartmentsAndRegions = _.uniqBy(
    [...departmentItems, ...location.departmentData],
    '_id',
  ).filter((dep) => departments.includes(dep._id));

  const selectedDepartments = selectedDepartmentsAndRegions.filter(
    (dep) => dep.type === 'departement',
  );
  const selectedRegions = selectedDepartmentsAndRegions.filter((dep) => dep.type === 'region');

  const submit = () => {
    if (schools.length !== 0 || departments.length !== 0 || isGlobal) {
      const locationName: string[] = [];

      if (isGlobal) {
        locationName.push('France enti??re');
      }

      if (selectedSchools.length !== 0) {
        locationName.push(`??coles : ${Format.schoolNameList(selectedSchools)}`);
      }

      if (selectedDepartmentsAndRegions.length !== 0) {
        locationName.push(
          `d??partements et r??gions : ${Format.departmentNameList(selectedDepartmentsAndRegions)}`,
        );
      }

      updateGroupCreationData({
        location: { schools, departments, global: isGlobal },
        locationName: locationName.join(', '),
      });

      next();
    } else {
      setError(true);
    }
  };

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  // Toggle location
  const toggle = (
    loc: AnySchool | AnyDepartment,
    data: string[],
    callback: (ids: string[]) => void,
  ) => {
    if (data.includes(loc._id)) {
      callback(data.filter((j) => j !== loc._id));
    } else {
      setError(false);
      callback([...data, loc._id]);
    }
  };

  return (
    <View style={styles.formContainer}>
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
              Vous pourrez publier des contenus dans ces localisations. S??lectionnez uniquement
              celles qui correspondent ?? votre champ d&apos;action.
            </Text>
          </View>
        </Card>
      </View>
      <View style={styles.listContainer}>
        {location.schoolData.map((s) => (
          <CheckboxListItem
            key={s._id}
            title={s.name}
            description={`??cole ?? ${s.address?.shortName || s.address?.address?.city}`}
            status={schools.includes(s._id) ? 'checked' : 'unchecked'}
            onPress={() => toggle(s, schools, setSchools)}
          />
        ))}
        {location.departmentData.map((d) => (
          <CheckboxListItem
            key={d._id}
            title={d.name}
            description={`D??partement ${d.code}`}
            status={departments.includes(d._id) ? 'checked' : 'unchecked'}
            onPress={() => toggle(d, departments, setDepartments)}
          />
        ))}
        <CheckboxListItem
          title="France enti??re"
          description="Contenus visibles pour tous les utilisateurs"
          status={isGlobal ? 'checked' : 'unchecked'}
          onPress={() => setGlobal(!isGlobal)}
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
                what: 'la r??cup??ration des localisations',
                contentPlural: 'Les localisations',
                contentSingular: 'La liste de localisations',
              }}
              type="axios"
              retry={() => {
                fetchMultiSchool([...schools, ...location.schools]);
                fetchMultiDepartment([...departments, ...location.departments]);
              }}
            />
          )}
          <List.Item
            title="??coles"
            description={Format.schoolNameList(selectedSchools)}
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
                      hideSearch: false,
                      subtitle: 'Cr??er un groupe',
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
            title="D??partements"
            description={Format.departmentNameList(selectedDepartments)}
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
                      hideSearch: false,
                      initialData: { schools, departments, global },
                      subtitle: 'Cr??er un groupe',
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
            title="R??gions"
            description={Format.departmentNameList(selectedRegions)}
            onPress={() =>
              navigation.push('Root', {
                screen: 'Main',
                params: {
                  screen: 'More',
                  params: {
                    screen: 'Location',
                    params: {
                      type: 'regions',
                      hideSearch: false,
                      subtitle: 'Cr??er un groupe',
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
        <HelperText visible={showError} type="error">
          Vous devez s??lectionner au moins une localisation
        </HelperText>
      </View>
      <View style={styles.buttonContainer}>
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
  const { location, schools, departments } = state;
  return {
    location,
    schoolItems: schools.items,
    departmentItems: departments.items,
    locationStates: {
      schools: schools.state,
      departments: departments.state,
    },
  };
};

export default connect(mapStateToProps)(GroupAddLocation);
