Releases can be found on [npm](https://www.npmjs.com/package/d3-financial-components).

#Process

* Setup [npm author info](https://docs.npmjs.com/getting-started/publishing-npm-packages) and ensure you're listed as a [collaborator on the repository](https://www.npmjs.com/package/d3-financial-components).
* Create a [GitHub personal access token](https://github.com/settings/tokens) and configure the environment variables `GITHUB_USERNAME` (your username) and `GITHUB_PASSWORD` (the access token).
* Fetch the latest changes from upstream.
* Checkout a local branch configured to use upstream/master as the remote. 
* Run the `grunt release` task (this will perform as build automatically).