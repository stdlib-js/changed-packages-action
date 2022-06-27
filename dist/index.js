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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MODULES //
const path_1 = require("path");
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const assert_contains_1 = __importDefault(require("@stdlib/assert-contains"));
// VARIABLES //
const RE_BENCHMARK = /\/benchmark($|\/)/i;
const RE_BIN = /\/bin($|\/)/i;
const RE_DATA = /\/data($|\/)/i;
const RE_DOCS = /\/docs($|\/)/i;
const RE_ETC = /\/etc($|\/)/i;
const RE_EXAMPLES = /\/examples($|\/)/i;
const RE_LIB = /\/lib($|\/)/i;
const RE_INCLUDE = /\/include($|\/)/i;
const RE_SRC = /\/src($|\/)/i;
const RE_TEST = /\/test($|\/)/i;
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
*     -   `src`
*     -   `test`
*
* @private
* @param {string} pkg - package tree path
* @returns {string} package name
*/
function stripOffInternals(pkg) {
    if (RE_BENCHMARK.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/benchmark'));
    }
    else if (RE_BIN.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/bin'));
    }
    else if (RE_DATA.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/data'));
    }
    else if (RE_DOCS.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/docs'));
    }
    else if (RE_ETC.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/etc'));
    }
    else if (RE_EXAMPLES.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/examples'));
    }
    else if (RE_LIB.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/lib'));
    }
    else if (RE_INCLUDE.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/include'));
    }
    else if (RE_SRC.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/src'));
    }
    else if (RE_TEST.test(pkg)) {
        pkg = pkg.substring(0, pkg.indexOf('/test'));
    }
    return pkg;
}
/**
* Returns the n-th index of the given search value in a string.
*
* @private
* @param {string} str - input string
* @param {string} searchValue - value to search for
* @param {number} n - index of which match to return
* @returns {number} n-th index
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
* @private
* @param {string} pkg - package tree path
* @param {number} level - desired dependency level
* @returns {string} ancestor package
*/
function prunePackage(pkg, level) {
    const idx = nthIndex(pkg, '/', level + 1);
    if (idx === -1) {
        return pkg;
    }
    return pkg.substring(0, idx);
}
// MAIN //
/**
* Main function.
*
* @returns {Promise<void>} promise indicating completion
*/
async function main() {
    const token = (0, core_1.getInput)('GITHUB_TOKEN', {
        required: true
    });
    const octokit = (0, github_1.getOctokit)(token);
    let base, head;
    switch (github_1.context.eventName) {
        case 'push':
            base = github_1.context.payload.before;
            head = github_1.context.payload.after;
            break;
        case 'pull_request': {
            const pullRequest = github_1.context.payload.pull_request;
            if (pullRequest) {
                base = pullRequest.base.sha;
                head = pullRequest.head.sha;
            }
            break;
        }
        default:
            (0, core_1.setFailed)('Unsupported event name: ' + github_1.context.eventName);
    }
    const response = await octokit.rest.repos.compareCommits({
        base,
        head,
        owner: github_1.context.repo.owner,
        repo: github_1.context.repo.repo
    });
    (0, core_1.debug)(JSON.stringify(response.data.files, null, '\t'));
    const files = response.data.files;
    const packages = [];
    for (let i = 0; i < files.length; i++) {
        const { filename } = files[i];
        if ((0, assert_contains_1.default)(filename, '@stdlib')) {
            let pkg = (0, path_1.dirname)(filename);
            pkg = stripOffInternals(pkg);
            pkg = pkg.substring(pkg.indexOf('@stdlib') + 8);
            if (!(0, assert_contains_1.default)(packages, pkg)) {
                packages.push(pkg);
            }
            const standalone = prunePackage(pkg, 0);
            if (!(0, assert_contains_1.default)(packages, standalone)) {
                packages.push(standalone);
            }
        }
    }
    (0, core_1.setOutput)('packages', packages);
}
main();
//# sourceMappingURL=index.js.map