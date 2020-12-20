import { MapLocation } from '@ts/types';

function buildFeatureCollections(places: MapLocation.Element[]) {
  const featureCollections = {
    cluster: {
      type: 'FeatureCollection' as const,
      features: [] as MapLocation.Cluster[],
    },
    event: {
      type: 'FeatureCollection' as const,
      features: [] as MapLocation.Point<'event'>[],
    },
    place: {
      type: 'FeatureCollection' as const,
      features: [] as MapLocation.Point<'place'>[],
    },
    school: {
      type: 'FeatureCollection' as const,
      features: [] as MapLocation.Point<'school'>[],
    },
  };
  places.forEach(({ dataType, ...place }) => {
    const { features } = featureCollections[dataType];

    const feature = {
      ...place,
      properties: {
        ...place.properties,
        type: dataType,
      },
    };

    // Typescript type inference is fairly limited when it comes to generics
    features.push(feature as any);
  });
  return featureCollections;
}

export { buildFeatureCollections };
