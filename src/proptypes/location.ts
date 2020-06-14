import PropTypes from 'prop-types';
import { schoolPopulatedPropType, departmentPopulatedPropType } from './common';

const locationPropType = PropTypes.shape({
  global: PropTypes.bool,
  schools: PropTypes.arrayOf(schoolPopulatedPropType),
  departments: PropTypes.arrayOf(departmentPopulatedPropType),
});

const addressPropType = PropTypes.shape({
  shortName: PropTypes.string.isRequired,
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
  address: PropTypes.shape({
    number: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    extra: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  }).isRequired,
  departments: PropTypes.arrayOf(departmentPopulatedPropType).isRequired,
});

const placePropType = PropTypes.shape({
  type: PropTypes.oneOf(['place', 'school', 'standalone']).isRequired,
  associatedSchool: schoolPopulatedPropType,
  associatedPlace: departmentPopulatedPropType,
  address: addressPropType,
});

export { placePropType, addressPropType, locationPropType };
