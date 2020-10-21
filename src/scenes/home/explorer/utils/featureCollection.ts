import shortid from 'shortid';
import { ExplorerLocation } from '@ts/types';
import { getAssetName } from './getAsset';

const createFeature = ({
  id,
  name,
  type,
  hasEvents,
  lon,
  lat,
}: {
  id: string;
  name?: string;
  type: ExplorerLocation.LocationTypes;
  hasEvents?: boolean;
  lon: number;
  lat: number;
}): Feature => {
  return {
    type: 'Feature',
    id,
    properties: {
      name,
      type,
      hasEvents,
      pinIcon: getAssetName(type, 'pin'),
      circleIcon: getAssetName(type, 'circle'),
    },
    geometry: {
      type: 'Point',
      coordinates: [lon, lat],
    },
  };
};

export type Feature = {
  type: 'Feature';
  id: string;
  properties: {
    [key: string]: any;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

export type FeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
};

function buildFeatureCollections(places: ExplorerLocation.Location[]) {
  const featureCollections: { [key in ExplorerLocation.LocationTypes]: FeatureCollection } = {
    collection: {
      type: 'FeatureCollection',
      features: [],
    },
    secret: {
      type: 'FeatureCollection',
      features: [],
    },
    event: {
      type: 'FeatureCollection',
      features: [],
    },
    place: {
      type: 'FeatureCollection',
      features: [],
    },
    school: {
      type: 'FeatureCollection',
      features: [],
    },
  };
  places.forEach((place) => {
    const { features } = featureCollections[place.type];
    switch (place.type) {
      case 'collection':
        features.push(
          createFeature({
            id: shortid(),
            type: place.type,
            lon: place.data.geo.coordinates[0],
            lat: place.data.geo.coordinates[1],
          }),
        );
        break;
      case 'event':
        // Loop through all places tied to the event and add a marker for each place of type "address"
        place.data.places.forEach((p) => {
          if (p.type === 'standalone') {
            features.push(
              createFeature({
                id: place.data._id,
                type: place.type,
                name: place.data.title,
                lon: p.address.geo.coordinates[0],
                lat: p.address.geo.coordinates[1],
              }),
            );
          }
        });
        break;
      case 'place':
        features.push(
          createFeature({
            id: place.data._id,
            type: place.type,
            name: place.data.displayName,
            lon: place.data.address.geo.coordinates[0],
            lat: place.data.address.geo.coordinates[1],
          }),
        );
        break;
      case 'secret':
        features.push(
          createFeature({
            id: place.data._id,
            type: place.type,
            name: place.data.displayName,
            lon: place.data.address.geo.coordinates[0],
            lat: place.data.address.geo.coordinates[1],
          }),
        );
        break;
      case 'school':
        features.push(
          createFeature({
            id: place.data._id,
            type: place.type,
            name: place.data.displayName,
            lon: place.data.address.geo.coordinates[0],
            lat: place.data.address.geo.coordinates[1],
            hasEvents: !!place.data.cache?.events,
          }),
        );
    }
  });
  return featureCollections;
}

export { buildFeatureCollections };
