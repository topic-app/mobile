/**
 * File containing frequently used types to be used in multiple places through the project.
 */
import theme from '@styles/Theme';
import { SchoolPreload, DepartmentPreload } from '@root/common/ts/api';
import { LocationRequestState } from '@root/common/ts/requestState';

export * from '@root/common/ts/api';
export type { RootState as State } from '@redux/reducers/index';
export type { Theme } from '@styles/Theme';
export type { StackNavigationProp } from '@react-navigation/stack';
export type { RouteProp } from '@react-navigation/native';

export type Preferences = {
  // This is equivalent to JS's Object.keys() for types (hover over theme for more info)
  theme: keyof typeof theme;
  useSystemTheme: boolean;
};

export type LocationList = {
  selected: boolean;
  global: boolean;
  schools: string[];
  schoolData: SchoolPreload[];
  departments: string[];
  departmentData: DepartmentPreload[];
  state: LocationRequestState;
};
