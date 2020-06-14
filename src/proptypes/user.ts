import PropTypes from 'prop-types';
import { globalDatePropType } from './common';

const userPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

const accountInfoPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  info: PropTypes.shape({
    joinDate: globalDatePropType.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    public: PropTypes.bool.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    description: PropTypes.string,
    following: PropTypes.shape({
      groups: PropTypes.arrayOf(PropTypes.string),
      users: PropTypes.arrayOf(PropTypes.string),
      events: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    location: {
      _id: PropTypes.string.isRequired, // Note: kind of useless, maybe someone could find a use for it
      global: PropTypes.bool.isRequired,
      schools: PropTypes.arrayOf(PropTypes.string), // Array of ids
      departments: PropTypes.arrayOf(PropTypes.string), // Array of ids
    },
    cache: PropTypes.shape({
      followers: PropTypes.number,
    }),
    sensitiveData: PropTypes.shape({ email: PropTypes.string }), // Optionnal
  }),
});

const authorPropType = userPropType;
const memberPropType = userPropType;

export { authorPropType, memberPropType, userPropType, accountInfoPropType };
