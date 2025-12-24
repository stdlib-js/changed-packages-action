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

// MODULES //

import { dirname } from 'path';
import { debug, getInput, setFailed, setOutput } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import contains from '@stdlib/assert-contains';
import { stripOffInternals, prunePackage } from './utils';


// MAIN //

/**
* Main function.
*
* @returns {Promise<void>} promise indicating completion
*/ 
async function main(): Promise<void> {
	const token = getInput( 'GITHUB_TOKEN', { 
		required: true 
	});
	const octokit = getOctokit( token );
	let base, head;
	switch ( context.eventName ) {
	case 'push':
		base = context.payload.before;
		head = context.payload.after;
		break;
	case 'pull_request': {
		const pullRequest = context.payload.pull_request;
		if ( pullRequest ) {
			base = pullRequest.base.sha;
			head = pullRequest.head.sha;
		}
		break;
	}
	default:
		setFailed( 'Unsupported event name: ' + context.eventName );
	}
	const response = await octokit.rest.repos.compareCommits({
		base,
		head,
		owner: context.repo.owner,
		repo: context.repo.repo
	});
	debug( JSON.stringify( response.data.files, null, '\t' ) );
	const files = response.data.files ?? [];
	const packages = [];
	for ( let i = 0; i < files.length; i++ ) {
		const { filename } = files[ i ];
		if ( contains( filename, '@stdlib' ) ) {
			let pkg = dirname( filename );
			pkg = stripOffInternals( pkg );
			pkg = pkg.substring( pkg.indexOf( '@stdlib' ) + 8 );
			if ( !contains( packages, pkg ) ) {
				packages.push( pkg );
			}
			const standalone = prunePackage( pkg, 0 );
			if ( !contains( packages, standalone ) ) {
				packages.push( standalone );
			}
		}
	}
	setOutput( 'packages', packages );
}

main();