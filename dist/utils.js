"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripOffInternals = stripOffInternals;
exports.prunePackage = prunePackage;
exports.nthIndex = nthIndex;
// VARIABLES //
const INTERNAL_DIRS = [
    'benchmark',
    'bin',
    'data',
    'docs',
    'etc',
    'examples',
    'include',
    'lib',
    'scripts',
    'src',
    'test'
];
const RE_INTERNAL = new RegExp('/(' + INTERNAL_DIRS.join('|') + ')(/|$)', 'i');
// FUNCTIONS //
/**
* Strips off internal directory paths from a package path.
*
* ## Notes
*
* -   The function strips off the following directory names:
*
*     -   `benchmark`
*     -   `bin`
*     -   `data`
*     -   `docs`
*     -   `etc`
*     -   `examples`
*     -   `lib`
*     -   `include`
*     -   `scripts`
*     -   `src`
*     -   `test`
*
* @param pkg - package tree path
* @returns package name
*/
function stripOffInternals(pkg) {
    const match = RE_INTERNAL.exec(pkg);
    if (match && match.index !== undefined) {
        return pkg.substring(0, match.index);
    }
    return pkg;
}
/**
* Returns the n-th index of the given search value in a string.
*
* @param str - input string
* @param searchValue - value to search for
* @param n - index of which match to return
* @returns n-th index
*/
function nthIndex(str, searchValue, n) {
    const len = str.length;
    let i = -1;
    while (n > 0 && i < len) {
        i += 1;
        i = str.indexOf(searchValue, i);
        if (i < 0) {
            break;
        }
        n -= 1;
    }
    return i;
}
/**
* Prunes a package name to an ancestor at the chosen level of the tree.
*
* @param pkg - package tree path
* @param level - desired dependency level
* @returns ancestor package
*/
function prunePackage(pkg, level) {
    const idx = nthIndex(pkg, '/', level + 1);
    if (idx === -1) {
        return pkg;
    }
    return pkg.substring(0, idx);
}
//# sourceMappingURL=utils.js.map