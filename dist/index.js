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
const utils_1 = require("./utils");
// VARIABLES //
const NULL_SHA = '0000000000000000000000000000000000000000';
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
    // Handle initial push where there is no previous commit (null SHA):
    if (base === NULL_SHA) {
        (0, core_1.debug)('Initial push detected (null SHA). Returning empty packages list.');
        (0, core_1.setOutput)('packages', []);
        return;
    }
    const response = await octokit.rest.repos.compareCommits({
        base,
        head,
        owner: github_1.context.repo.owner,
        repo: github_1.context.repo.repo
    });
    (0, core_1.debug)(JSON.stringify(response.data.files, null, '\t'));
    const files = response.data.files ?? [];
    const packages = [];
    for (let i = 0; i < files.length; i++) {
        const { filename } = files[i];
        if ((0, assert_contains_1.default)(filename, '@stdlib')) {
            let pkg = (0, path_1.dirname)(filename);
            pkg = (0, utils_1.stripOffInternals)(pkg);
            pkg = pkg.substring(pkg.indexOf('@stdlib') + 8);
            if (!(0, assert_contains_1.default)(packages, pkg)) {
                packages.push(pkg);
            }
            const standalone = (0, utils_1.prunePackage)(pkg, 0);
            if (!(0, assert_contains_1.default)(packages, standalone)) {
                packages.push(standalone);
            }
        }
    }
    (0, core_1.setOutput)('packages', packages);
}
main();
//# sourceMappingURL=index.js.map