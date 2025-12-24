/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import tape = require( 'tape' );
import { stripOffInternals } from '../src/utils';


// TESTS //

tape( 'main export is a function', function test( t: tape.Test ) {
	t.ok( true, __filename );
	t.strictEqual( typeof stripOffInternals, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function strips /scripts and everything after', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'random/array/scripts/scaffolds/binary' );
	t.strictEqual( actual, 'random/array', 'returns expected value' );
	t.end();
});

tape( 'the function strips /scripts/scaffolds/binary/data (nested internal dirs)', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'random/array/scripts/scaffolds/binary/data' );
	t.strictEqual( actual, 'random/array', 'returns expected value' );
	t.end();
});

tape( 'the function strips /lib paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'math/base/special/abs/lib' );
	t.strictEqual( actual, 'math/base/special/abs', 'returns expected value' );
	t.end();
});

tape( 'the function strips /lib/index.js paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'math/base/special/abs/lib/index.js' );
	t.strictEqual( actual, 'math/base/special/abs', 'returns expected value' );
	t.end();
});

tape( 'the function strips /test paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'random/array/test/test.js' );
	t.strictEqual( actual, 'random/array', 'returns expected value' );
	t.end();
});

tape( 'the function strips /benchmark paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'random/array/benchmark/benchmark.js' );
	t.strictEqual( actual, 'random/array', 'returns expected value' );
	t.end();
});

tape( 'the function strips /docs paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'random/array/docs/types/index.d.ts' );
	t.strictEqual( actual, 'random/array', 'returns expected value' );
	t.end();
});

tape( 'the function strips /examples paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'random/array/examples/index.js' );
	t.strictEqual( actual, 'random/array', 'returns expected value' );
	t.end();
});

tape( 'the function strips /data paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'datasets/afinn-111/data/data.json' );
	t.strictEqual( actual, 'datasets/afinn-111', 'returns expected value' );
	t.end();
});

tape( 'the function strips /src paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'math/base/special/abs/src/main.c' );
	t.strictEqual( actual, 'math/base/special/abs', 'returns expected value' );
	t.end();
});

tape( 'the function strips /include paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'math/base/special/abs/include/stdlib' );
	t.strictEqual( actual, 'math/base/special/abs', 'returns expected value' );
	t.end();
});

tape( 'the function strips /bin paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'tools/cli/bin/cli' );
	t.strictEqual( actual, 'tools/cli', 'returns expected value' );
	t.end();
});

tape( 'the function strips /etc paths', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'tools/make/etc/config.mk' );
	t.strictEqual( actual, 'tools/make', 'returns expected value' );
	t.end();
});

tape( 'the function handles paths without internal dirs', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'random/array' );
	t.strictEqual( actual, 'random/array', 'returns expected value' );
	t.end();
});

tape( 'the function handles empty string', function test( t: tape.Test ) {
	const actual = stripOffInternals( '' );
	t.strictEqual( actual, '', 'returns expected value' );
	t.end();
});

tape( 'the function is case-insensitive', function test( t: tape.Test ) {
	const actual = stripOffInternals( 'random/array/LIB/index.js' );
	t.strictEqual( actual, 'random/array', 'returns expected value' );
	t.end();
});

tape( 'the function finds first internal dir when multiple present', function test( t: tape.Test ) {
	// This is the key test case - /scripts comes before /data in the path
	const actual = stripOffInternals( 'random/array/scripts/data/test' );
	t.strictEqual( actual, 'random/array', 'strips at first internal dir /scripts, not /data or /test' );
	t.end();
});
