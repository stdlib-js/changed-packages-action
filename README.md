<!--

@license Apache-2.0

Copyright (c) 2021 The Stdlib Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->

# Changed Packages Action

> A GitHub action to return the list of changed stdlib packages in a push or pull request.

## Example Workflow

```yml
# Workflow name:
name: Push Changes to Standalone Repositories

# Workflow triggers:
on:
  push:

# Workflow jobs:
jobs:
  assign:
    # Define the type of virtual host machine on which to run the job:
    runs-on: ubuntu-latest

    # Define the sequence of job steps...
    steps:
      # Retrieve list of changed stdlib packages in a push or pull request:
      - name: 'Retrieve list of changed stdlib packages'
        id: 'changed-packages'
        uses: stdlib-js/changed-packages-action@v1.0
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      # Push changes to the standalone package repositories:
      - name: 'Push changes to standalone package repositories'
        run: |
          echo ${{ steps.changed-packages.outputs.packages }}
```


## Inputs

-   `GITHUB_TOKEN` (string) **required**: GitHub personal access token with `repo` scope.


## Outputs 

-  `packages` (array of strings): List of changed stdlib packages.


## License

See [LICENSE][stdlib-license].


## Copyright

Copyright &copy; 2021. The Stdlib [Authors][stdlib-authors].

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="links">

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/assign-issue-on-label-action/master/LICENSE

</section>

<!-- /.links -->