import { Department, DepartmentPreload, AnySchool } from '@ts/types';
import { Format } from '@utils';

type LocationItemType = 'school' | 'department' | 'region' | 'other';

export type LocationItem = {
  id: string;
  name: string;
  type: LocationItemType;
  description?: string;
  departmentIds?: string[];
};

export function getNewLocations<T extends LocationItemType>(
  type: T,
  locationData: {
    school: AnySchool;
    department: Department | DepartmentPreload;
    region: Department | DepartmentPreload;
    other: never;
  }[T][],
): LocationItem[] {
  if (type === 'other') {
    return [
      {
        id: 'global',
        name: 'France entière',
        description: "Pas de département ou d'école spécifique",
        type: 'other',
      },
    ];
  }

  if (type === 'school') {
    return (locationData as AnySchool[]).map((sch) => ({
      id: sch._id,
      name: sch.name,
      type: 'school',
      description: sch.address && Format.shortAddress(sch.address, sch.departments),
      departmentIds: sch.departments?.map((dep) => dep._id),
    }));
  } else if (type === 'department') {
    return (locationData as DepartmentPreload[])
      .filter((dep) => dep.type === 'departement')
      .map((dep) => ({
        id: dep._id,
        name: dep.name,
        type: 'department',
        description: `Département ${dep.code}`,
      }));
  } else if (type === 'region') {
    return (locationData as DepartmentPreload[])
      .filter((dep) => dep.type === 'region')
      .map((dep) => ({
        id: dep._id,
        name: dep.name,
        type: 'department',
        description: `Région ${dep.code}`,
      }));
  }

  return [];
}
