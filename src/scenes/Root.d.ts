/* eslint-disable no-var */

// Source: https://stackoverflow.com/a/43531355
// This file exists for two purposes:
// 1. Ensure that both ios and android files present identical types to importers.
// 2. Allow consumers to import the module as if typescript understood react-native suffixes.
import DefaultAndroid from './Root.android';
import * as android from './Root.android';
import DefaultIos from './Root.ios';
import * as ios from './Root.ios';

declare var _test: typeof ios;
declare var _test: typeof android;

declare var _testDefault: typeof DefaultIos;
declare var _testDefault: typeof DefaultAndroid;

export * from './Root.ios';
export default DefaultAndroid;
