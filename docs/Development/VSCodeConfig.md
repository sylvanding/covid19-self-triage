# VS Code Config

We generally use `ESlint` to help flag potential errors and bugs, and `Prettier` to format and beautify our code. 

## Setting up Vetur with VS Code

The presence of `jsconfig.json` file in a directory indicates that the directory is the root of a JavaScript Project. The `jsconfig.json` file specifies the root files and the options for the features provided by the [JavaScript language service](https://github.com/microsoft/TypeScript/wiki/JavaScript-Language-Service-in-Visual-Studio).

Create a `jsconfig.json`, which will include all Vue files and files that they import from, for example:

```json
{
  "include": [
    "./src/**/*"
  ]
}
```

## Setting up ESLint and Prettier with VS Code

You will need to install the appropriate extension/plugin for your code editor. For `VS Code`, install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode). These plugins have millions of downloads each, so it'll be difficult to miss them in the VS Code extension marketplace. Once you've installed these, we are ready to move on to configuring each of them for proper usage.

Linters usually contain not only code quality rules, but also stylistic rules. Most stylistic rules are unnecessary when using Prettier, but worse – they might conflict with Prettier! 

Luckily it’s easy to turn off rules that conflict or are unnecessary with Prettier. Package `eslint-config-prettier` can exclude all ESLint rules that could conflict with Prettier. 

Install eslint-config-prettier:

```shell
npm install eslint-config-prettier --save-dev --legacy-peer-deps
```

You may meet upstream dependency conflict when installing NPM packages with the latest npm version (v8). The effective solution to this error is to pass a command `--legacy-peer-deps` to the npm install that can help ignore the peer dependencies and continue the installation.

Once the setup is successful, you should see a file `eslintrc.js` based on the format you chose your configuration file to be in. 

Then, add `"prettier"` to the "extends" array in your `.eslintrc.js` file. Make sure to put it **last,** so it gets the chance to override other configs.

```json
{
  "extends": [
    "some-other-config-you-use",
    "prettier"
  ]
}
```

Create `.prettierrc` file written in JSON as configuration file for Prettier:

```json
{
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "embeddedLanguageFormatting": "auto",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxSingleQuote": false,
  "printWidth": 80,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "requirePragma": false,
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false,
  "vueIndentScriptAndStyle": false
}
```
