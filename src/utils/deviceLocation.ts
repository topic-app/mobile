import * as Permissions from 'expo-permissions';
import LocationService from 'react-native-geolocation-service';

import { logger } from '@utils';

export namespace Location {
  /**
   * Get status on location permission
   * @returns Boolean indicating if location permission can be requested or not
   */
  export async function getStatus(): Promise<'yes' | 'no' | 'never' | 'error'> {
    let result: Permissions.PermissionResponse;
    try {
      result = await Permissions.getAsync(Permissions.LOCATION);
    } catch (e) {
      logger.warn('deviceLocation: error encountered while getting location permission');
      return 'error';
    }
    const { status, canAskAgain } = result;
    // User previously granted permission
    if (status === Permissions.PermissionStatus.GRANTED) {
      return 'yes';
    } else if (canAskAgain) {
      return 'no';
    } else {
      return 'never';
    }
  }

  /**
   * Get status on location permission
   * @returns Boolean indicating if location permission can be requested or not
   */
  export async function request(): Promise<'yes' | 'no' | 'never' | 'error'> {
    let result: Permissions.PermissionResponse;
    try {
      result = await Permissions.askAsync(Permissions.LOCATION);
    } catch (e) {
      logger.warn('deviceLocation: error encountered while asking for location permission');
      return 'error';
    }
    const { status, canAskAgain } = result;
    // User previously granted permission
    if (status === Permissions.PermissionStatus.GRANTED) {
      return 'yes';
    } else if (canAskAgain) {
      return 'no';
    } else {
      return 'never';
    }
  }

  export type Coordinates = LocationService.GeoCoordinates;

  /**
   * Get device location, assumes location permission has already been requested
   * @returns Object with latitude and longitude information
   */
  export async function getCoordinates(): Promise<Coordinates> {
    const info = await new Promise<LocationService.GeoPosition>((resolve, reject) =>
      LocationService.getCurrentPosition(resolve, reject),
    );
    return info.coords;
  }
}
