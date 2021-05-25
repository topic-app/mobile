import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import LocationService from 'react-native-geolocation-service';

import logger from './logger';
import { trackEvent } from './plausible';

export namespace Location {
  /**
   * Get status on location permission
   * @returns String indicating whether location can be requested or not
   */
  export async function getStatus(): Promise<'yes' | 'no' | 'never' | 'error'> {
    if (Platform.OS === 'web') return 'no';
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
   * @returns String indicating whether location can be requested or not
   */
  export async function request(): Promise<'yes' | 'no' | 'never' | 'error'> {
    if (Platform.OS === 'web') return 'no';
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
      trackEvent('landing:locate-accept-permission');
      return 'yes';
    } else if (canAskAgain) {
      trackEvent('landing:locate-reject-permission');
      return 'no';
    } else {
      trackEvent('landing:locate-reject-permission');
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
      LocationService.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 15000,
      }),
    );
    return info.coords;
  }
}
