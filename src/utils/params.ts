import Store from '@redux/store';
import { ReduxLocation } from '@ts/types';

function getContentParams(): ReduxLocation {
  const { location } = Store.getState();
  // The filter is normally not necessary but we seem to frequently have problems with the data
  return {
    schools: location.schools.filter((s) => !!s),
    departments: [
      ...location.departments,
      ...location.schoolData.flatMap((s) => s.departments?.map((d) => d._id) || []),
    ].filter((d) => !!d),
    global: true,
  };
}

export { getContentParams };
export default getContentParams;
