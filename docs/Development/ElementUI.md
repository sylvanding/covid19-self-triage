# Element UI

```shell
npm i element-ui -S
```

## On demand

With the help of `babel-plugin-component`, we can import components we actually need, making the project smaller than otherwise.

First, install `babel-plugin-component` and `babel-preset-es2015`:

```shell
npm install babel-plugin-component -D
npm install --save-dev babel-preset-es2015
```

Then add the following preset and plugins to `.babelrc`:

```js
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

Next, we edit `main.js` to import components globally:

```js
import Vue from 'vue';
import { Button, Select } from 'element-ui';
import App from './App.vue';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
/* or
 * Vue.use(Button)
 * Vue.use(Select)
 */

new Vue({
  el: '#app',
  render: h => h(App)
});
```

## DatePicker problem

When using `el-date-picker`, the browser console would send a vue warning: 

```
... Prop being mutated: "placement" found in <ElDatePicker> ...
```

The problem arose because the latest element-ui (v2.15.9) changes vue props `placement` in the child component `date-picker`, which is not allowed in vue since the value will be overwritten whenever the parent component re-renders. The source code causing this issue seems like:

```js
// node_modules/element-ui/packages/date-picker/src/picker.vue

const NewPopper = {
  props: {
    placement: Popper.props.placement,
  },
};

const PLACEMENT_MAP = {
  left: 'bottom-start',
  center: 'bottom',
  right: 'bottom-end'
};

export default {
  created() {
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false
    };
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;

    this.$on('fieldReset', this.handleFieldReset);
  },
}
```

Note that `this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;` modified props `placement`. We resolve the problem by just simply muting this code according to [#21943](https://github.com/ElemeFE/element/issues/21943). 

We use `patch-package` to make and keep fixes to npm dependencies:

```shell
# install patch-package
npm i patch-package -D --legacy-peer-deps
```

Download element-ui releases [v2.15.9](https://github.com/ElemeFE/element/releases/tag/v2.15.9) on GitHub, make the above modification to your downloaded git repo and rebuild element-ui to overwrite the lib folder in `node_modules/element-ui`:

```shell
cd /path/to/your/repo
npm install --legacy-peer-deps
vim packages/date-picker/src/picker.vue
npm run dist
mv -f /path/to/your/repo/lib /path/to/your/project/node_modules/element-ui/lib
```

> Attention! The version of dependency `node-sass` in element-ui git repo must match your node version. [Node version support policy](https://github.com/sass/node-sass#Node-version-support-policy) tells you about that. Modify package.json in your repo so that no error would be thrown. 

Then we fix this bug in our dependencies after replacing the lib folder of element-ui, and run: 

```shell
# use npx (included with npm > 5.2) to create a .patch file
npx patch-package element-ui

# patch-package 6.4.7
# • Creating temporary folder
# • Installing element-ui@2.15.9 with npm
# • Diffing your files with clean files
# ✔ Created file patches/element-ui+2.15.9.patch
```

If this is the first time you've used `patch-package`, it will create a folder called `patches` in the root dir of your app. Inside will be a file called `element-ui+2.15.9.patch`, which is a diff between normal old package name and your fixed version. Commit this to share the fix with your team: 

```shell
# commit the patch file to share the fix with your team
git add patches/element-ui+2.15.9.patch
git commit -m "fix picker.vue in element-ui@2.15.9"
```

In `package.json`, make the following change to make sure the modification will be kept when reinstall the dependency: 

```diff
 "scripts": {
+  "postinstall": "patch-package"
 }
```
