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

const { dirname } = require( 'path' );
const core = require( '@actions/core' );
const github = require( '@actions/github' );
const contains = require( '@stdlib/assert-contains' );


// FUNCTIONS //

/**
* Returns the n-th index of the given search value in a string.
*
* @private
* @param {string} str - input string
* @param {string} searchValue - value to search for
* @param {number} n - index of which match to return
* @returns {number} n-th index
*/
function nthIndex( str, searchValue, n ) {
	var len = str.length;
	var i = -1;
	while ( n > 0 && i < len ) {
		i += 1;
		i = str.indexOf( searchValue, i );
		if ( i < 0 ) {
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
function prunePackage( pkg, level ) {
	var idx = nthIndex( pkg, '/', level + 1 );
	if ( idx === -1 ) {
		return pkg;
	}
	return pkg.substring( 0, idx );
}


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
	core.info( JSON.stringify( response.data.files, null, '\t' ) );
	const files = response.data.files;
	const packages = [];
	for ( let i = 0; i < files.length; i++ ) {
		const { filename } = files[ i ];
		if ( contains( filename, '@stdlib' ) ) {
			let pkg = dirname( filename );
			pkg = pkg.substring( pkg.indexOf( '@stdlib' ) + 7 );
			packages.push( pkg );
			const standalone = prunePackage( pkg, 0 );
			packages.push( standalone );
		}
	}
	core.setOutput( 'packages', packages );
}

main();