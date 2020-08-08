import { getColorFromType } from './getAsset';

function FeatureCollection(collectionType) {
  this.type = 'FeatureCollection';
  this.collectionType = collectionType;
  this.features = [];
}

function buildFeatureCollections(places) {
  const featureCollections = {};
  places.forEach((place) => {
    if (!(place.type in featureCollections)) {
      // If we encounter a new place type, append a new collection to the array
      featureCollections[place.type] = new FeatureCollection(place.type);
    }
    featureCollections[place.type].features.push({
      type: 'Feature',
      id: place._id,
      properties: {
        name: place.name,
        type: place.type,
        hasEvents: place.cache?.events !== undefined,
        pinIcon: getColorFromType(place.type, 'pin'),
        circleIcon: getColorFromType(place.type, 'circle'),
      },
      geometry: {
        type: 'Point',
        coordinates: [place.position.lng, place.position.lat],
      },
    });
  });
  // Turn it back into an array for easy manipulation with .map()
  return Object.values(featureCollections);
}

export { buildFeatureCollections };
export default buildFeatureCollections;
