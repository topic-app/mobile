// Workaround from https://github.com/Microsoft/TypeScript/issues/8328#issuecomment-219583152
// that allows multiple platform files
// Note: this method means both platform components need to have the same types
import * as ios from './HomeTwo.ios';
import * as android from './HomeTwo.android';

declare var _test: typeof ios;
declare var _test: typeof android;

export * from './HomeTwo.android';
