/* eslint-disable no-var */

// Source: https://stackoverflow.com/a/43531355
// This file exists for two purposes:
// 1. Ensure that both ios and android files present identical types to importers.
// 2. Allow consumers to import the module as if typescript understood react-native suffixes.
import DefaultIos from './HomeOne.ios';
import * as ios from './HomeOne.ios';
import DefaultAndroid from './HomeOne.android';
import * as android from './HomeOne.android';

declare var _test: typeof ios;
declare var _test: typeof android;

declare var _testDefault: typeof DefaultIos;
declare var _testDefault: typeof DefaultAndroid;

export * from './HomeOne.ios';
export default DefaultAndroid;
