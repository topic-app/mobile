import PropTypes from 'prop-types';

// Can change this to Date if need be
const globalDatePropType = PropTypes.string;

// GENERAL TYPES

const imagePropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  thumbnails: PropTypes.shape({
    small: false,
    medium: false,
    large: false,
  }).isRequired,
});

const userPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

const groupPropType = {
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  image: imagePropType,
};

const authorPropType = userPropType;
const memberPropType = userPropType;

const socialPropType = PropTypes.shape({
  twitter: PropTypes.string,
  instagram: PropTypes.string,
  facebook: PropTypes.string,
});

const tagPropType = PropTypes.shape({
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

const locationPropType = PropTypes.shape({
  shortName: PropTypes.string.isRequired,
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
  address: PropTypes.shape({
    street: PropTypes.shape.isRequired,
    suite: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    zipcode: PropTypes.string.isRequired,
  }).isRequired,
  department: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
});

const placePropType = PropTypes.shape({
  type: PropTypes.oneOf(['school', 'standalone']).isRequired,
  associatedSchool: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }),
  location: locationPropType,
});

// ARTICLE-RELATED TYPES

const articlePropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: globalDatePropType.isRequired,
  summary: PropTypes.string.isRequired,
  content: contentPropType.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
  image: imagePropType.isRequired,
  imageUrl: PropTypes.string.isRequired,
  author: authorPropType.isRequired,
  group: groupPropType.isRequired,
  tags: PropTypes.arrayOf(tagPropType).isRequired,
});

const shortArticlePropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: globalDatePropType.isRequired,
  summary: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
  // image: imagePropType.isRequired,
  author: authorPropType.isRequired,
  group: groupPropType.isRequired,
  tags: PropTypes.arrayOf(tagPropType).isRequired,
});

// EVENT-RELATED TYPES

const eventEntryPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  duration: durationPropType.isRequired,
});

const eventPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  content: contentPropType.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
  group: groupPropType.isRequired,
  author: authorPropType.isRequired,
  members: PropTypes.arrayOf(memberPropType).isRequired,
  tags: PropTypes.arrayOf(tagPropType).isRequired,
  duration: durationPropType.isRequired,
  program: PropTypes.arrayOf(eventEntryPropType).isRequired,
  places: PropTypes.arrayOf(placePropType).isRequired,
  contact: PropTypes.shape({
    user: userPropType.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    social: socialPropType.isRequired,
    other: PropTypes.string, // Note: people might use this to self-advertise, like 'follow me on snap - @somebody!'
  }).isRequired,
  cache: PropTypes.shape({
    followers: PropTypes.number.isRequired,
  }).isRequired,
});

const shortEventPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
  group: groupPropType.isRequired,
  author: authorPropType.isRequired,
  tags: PropTypes.arrayOf(tagPropType).isRequired,
  duration: durationPropType.isRequired,
  places: PropTypes.arrayOf(placePropType).isRequired,
  cache: PropTypes.shape({
    followers: PropTypes.number.isRequired,
  }).isRequired,
});

// EXPLORER-RELATED TYPES

const explorerPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['event', 'school', 'museum']).isRequired,
  location: locationPropType.isRequired,
  content: contentPropType,
  imageUrl: PropTypes.string,
});

const shortExplorerPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['event', 'school', 'museum']).isRequired,
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
});
// EXPLORER-RELATED TYPES

const voteDataPropType = PropTypes.shape({
  type: PropTypes.oneOf(['sign', 'goal', 'multiple', 'opinion']).isRequired,
  for: PropTypes.number,
  against: PropTypes.number,
  opinions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      votes: PropTypes.number,
    }),
  ),
  votes: PropTypes.number,
  goal: PropTypes.number,
});

const petitionPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  content: contentPropType,
  voteData: voteDataPropType.isRequired,
  status: PropTypes.oneOf(['open', 'closed']).isRequired, // Any other status?
  duration: durationPropType.isRequired,
  publisher: PropTypes.shape({
    type: PropTypes.oneOf(['user', 'group']).isRequired,
    user: userPropType,
    group: groupPropType,
  }).isRequired,
  imageUrl: PropTypes.string,
  tags: PropTypes.arrayOf(tagPropType).isRequired,
  // location: ...
});

const shortPetitionPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  voteData: voteDataPropType.isRequired,
  status: PropTypes.oneOf(['open', 'closed']).isRequired, // Any other status?
  duration: durationPropType.isRequired,
  publisher: PropTypes.shape({
    type: PropTypes.oneOf(['user', 'group']).isRequired,
    user: userPropType,
    group: groupPropType,
  }).isRequired,
  tags: PropTypes.arrayOf(tagPropType).isRequired,
  // location: ...
});

export {
  shortArticlePropType,
  shortEventPropType,
  shortExplorerPropType,
  shortPetitionPropType,
  articlePropType,
  eventPropType,
  explorerPropType,
  petitionPropType,
};
