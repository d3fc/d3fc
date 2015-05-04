Releases can be found on [npm](https://www.npmjs.com/package/d3-financial-components).

#Process

* Setup [npm author info](https://docs.npmjs.com/getting-started/publishing-npm-packages) and ensure you're listed as a [collaborator on the repository](https://www.npmjs.com/package/d3-financial-components).
* Create a [GitHub personal access token](https://github.com/settings/tokens) and configure the environment variables `GITHUB_USERNAME` (your username) and `GITHUB_PASSWORD` (the access token).
* Checkout the master branch. `git checkout master`
* Fetch the latest changes from upstream. `git fetch upstream`
* Reset the local branch to match upstream master. `git reset --HARD upstream/master`
* Perform a build. `grunt` (n.b. this should happend automatically but doesn't #329)
* Run the `grunt release` task.
