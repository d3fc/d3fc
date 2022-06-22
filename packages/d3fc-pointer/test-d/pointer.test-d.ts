import { pointer } from '../index';
import { expectAssignable, expectError, expectType } from 'tsd';
import * as d3 from 'd3';

/**
 * We expect Pointer to have the following type for our tests:
 * Input: <GElement extends BaseType, Datum, PElement extends BaseType, PDatum>
 * Returns: void
 */

const button = d3.select('button');
type ParamType = Parameters<typeof pointer>[0]; // fetch parameter's type

// Test returns void
expectType<void>(pointer(button));

// Test input types
expectAssignable<ParamType>(button);
const button2 = button.clone();
expectAssignable<ParamType>(button2);

// Bad inputs return an error
expectError(pointer(3));
expectError(pointer('somestring'));
expectError(pointer(document.querySelector('button')));
expectError(pointer(document));

// Expect exactly 1 argument
expectError(pointer());
expectError(pointer(button, button2));
