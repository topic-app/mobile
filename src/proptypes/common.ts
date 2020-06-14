import PropTypes from 'prop-types';

// Can change this to Date if need be
const globalDatePropType = PropTypes.string;

const socialPropType = PropTypes.shape({
  twitter: PropTypes.string,
  instagram: PropTypes.string,
  facebook: PropTypes.string,
});

const tagPopulatedPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
});

const contentPropType = PropTypes.shape({
  parser: PropTypes.oneOf(['plaintext', 'markdown']).isRequired,
  data: PropTypes.string.isRequired,
});

const durationPropType = PropTypes.shape({
  start: globalDatePropType.isRequired,
  end: globalDatePropType.isRequired,
});

const schoolPopulatedPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  shortName: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  type: PropTypes.arrayOf(PropTypes.enum(['lycee', 'college', 'prepa', 'other'])),
});

const departmentPopulatedPropType = schoolPopulatedPropType;

export {
  globalDatePropType,
  socialPropType,
  tagPopulatedPropType,
  contentPropType,
  durationPropType,
  schoolPopulatedPropType,
  departmentPopulatedPropType,
};
