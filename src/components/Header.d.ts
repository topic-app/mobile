/* eslint-disable no-var */

// Source: https://stackoverflow.com/a/43531355
// This file exists for two purposes:
// 1. Ensure that both ios and android files present identical types to importers.
// 2. Allow consumers to import the module as if typescript understood react-native suffixes.
import * as ios from './Header.ios';
import * as android from './Header.android';

declare var _test: typeof ios;
declare var _test: typeof android;

export * from './Header.ios';
export default android;
