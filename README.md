# Bundlewatch GitHub Action

This GitHub action allows you to easily run [bundlewatch](https://github.com/bundlewatch/bundlewatch) in your repository.

## How to use:
1. Add bundlewatch configuration in your package.json. Refer to this [doc](https://bundlewatch.io/#/getting-started/using-a-config-file) for more complete explanation. 
    ```
    {
      "name": "my-package",
      "bundlewatch": {
        "trackBranches": [
          "master"
        ],
        "files": [
          {
            "path": "./packages/react-isomorphic-data/dist/esm/index.js",
            "maxSize": "4.5 KB"
          }
        ]
      }
    }
    ```
    An example of a real-world project using this can be seen [here](https://github.com/jackyef/react-isomorphic-data/blob/master/package.json#L67)

2. Get a `BUNDLEWATCH_GITHUB_TOKEN` by following this [step](https://github.com/bundlewatch/bundlewatch#ci-auth-variables-needed-by-bundlewatch)

3. Set the token as a secret in your GitHub repository
![image](https://user-images.githubusercontent.com/7252454/71350610-2f7ff280-25a4-11ea-9114-4d8173633e85.png)

4. Setup a workflow.yml for your tracked branch. For example, if you are tracking the bundlesize of master branch, you should create a workflow whenever a `push` to `master` happen like so:
    ```yml
    name: "Bundlewatch Github Action - on Tracked Branches Push"

    on:
      push: 
        branches:
        - master

    jobs:
      bundlewatch:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - uses: Borales/actions-yarn@v2.1.0
        - run: yarn install
        - uses: jackyef/bundlewatch-gh-action@master
          with:
            build-script: yarn build:minify
            bundlewatch-github-token: ${{ secrets.BUNDLEWATCH_GITHUB_TOKEN }}
    ```
    You would probably want to change the `build-script` to whatever script you want to run to produce your output bundle.

    _Note: `build-script` is actually optional, just in case your workflow does not need build step and you are measuring the size of already committed files_
    
    _Note 2: It is recommended to use a specific version of this action instead of `@master`. For example: `- uses: jackyef/bundlewatch-gh-action@0.1.0`. This is because some commits that aren't ready to be released yet might make it into `master` branch._

5. For adding statuses on pull requests, you can add another workflow for pull requests `synchronize` and `opened` events as following:
    ```yml
    name: "Bundlewatch Github Action"

    on:
      pull_request: 
        types: [synchronize, opened]

    jobs:
      bundlewatch:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - uses: Borales/actions-yarn@v2.1.0
        - run: yarn install
        - uses: jackyef/bundlewatch-gh-action@master
          with:
            build-script: yarn build:minify
            bundlewatch-github-token: ${{ secrets.BUNDLEWATCH_GITHUB_TOKEN }}
    ```

6. If you are using an external config file, you can pass the file path to `bundlewatch-config` parameter
  ```yml
    name: "Bundlewatch Github Action"

    on:
      pull_request: 
        types: [synchronize, opened]

    jobs:
      bundlewatch:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - uses: Borales/actions-yarn@v2.1.0
        - run: yarn install
        - uses: jackyef/bundlewatch-gh-action@master
          with:
            build-script: yarn build:minify
            bundlewatch-github-token: ${{ secrets.BUNDLEWATCH_GITHUB_TOKEN }}
            bundlewatch-config: .bundlewatch.config.js
    ```
## Feedback
Feel free to open issues for feature requests. If you want to contribute, feel free to open a pull request as well!

## Credits
This GitHub action will not be possible without the work done at [bundlewatch](https://github.com/bundlewatch/bundlewatch). Go there and give them a star! :star:
