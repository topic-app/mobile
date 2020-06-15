// Workaround from https://github.com/Microsoft/TypeScript/issues/8328#issuecomment-219583152
// that allows multiple platform files
// Note: both platform components need to have the same types
import * as ios from './Header.ios';
import * as android from './Header.android';

declare var _test: typeof ios;
declare var _test: typeof android;

export * from './Header.android';
