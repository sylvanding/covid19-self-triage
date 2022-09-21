# Vue CLI

If you choose to start from `Vue CLI` webpack template, install all packages manually and make sure **not** to automatically install any compatible updates to vulnerable dependencies by `npm audit fix`. 

```shell
# install vue globally
npm install -g vue-cli

# check vue's version
vue -V # 2.9.6

# use vue template `webpack` to create a project
vue init webpack my-project

? Project name my-project
? Project description A Vue.js project
? Author Sylvan Ding <sylvanding@qq.com>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) no

cd my-project

npm install
```
