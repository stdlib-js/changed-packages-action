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

const core = require( '@actions/core' );
const github = require( '@actions/github' );


// MAIN //

/**
* Main function.
*/ 
async function main() {
	const token = core.getInput( 'GITHUB_TOKEN', { 
		required: true 
	});
	const context = github.context;
	const octokit = github.getOctokit( token );
	let base, head;
	switch ( context.eventName ) {
	case 'push':
		base = context.payload.before;
		head = context.payload.after;
		break;
	case 'pull_request': {
		let pullRequest = context.payload.pull_request;
		if ( pullRequest ) {
			base = pullRequest.base.sha;
			head = pullRequest.head.sha;
		}
		break;
	}
	default:
		core.setFailed( 'Unsupported event name: ' + eventName );
	}
	const response = await octokit.rest.repos.compareCommits({
		base,
		head,
		owner: context.repo.owner,
		repo: context.repo.repo
	});
	core.info( JSON.stringify(response, null, '\t' ) );
	const files = response.data.files;
	core.info( 'Files changed:' );
	for ( const file of files ) {
		core.info( '\t', file.filename );
	}
	core.setOutput( 'packages', [] );
}

main();