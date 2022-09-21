# Pre-Processor

We use `Less` as our pre-processor for the project. You need to manually install the corresponding webpack loaders with correct versions:

```shell
# Less
npm i less@3.9.0 less-loader@4.1.0 -D --legacy-peer-deps
```

Then add the loader to your `webpack` config `build/webpack.base.conf.js`. For example:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
};
```

For every single Vue component, we create a corresponding Less file in `src/assets/styles`. 

You can automatically import files (for colors, variables, mixins...) by   following the next steps.

> Simply using the [style-resources-loader](https://github.com/yenshih/style-resources-loader) or [vue-cli-plugin-style-resources-loader](https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader) to set global less variables is for Vue CLI 3, which creates a new project by running `vue create`. We use Vue CLI 2, running `vue init` to create a project. So make sure that you won't use these packages under Vue CLI 2 environment because `vue.config.js` is unavailable. 

First install the package:

```shell
# install package
npm i sass-resources-loader -D --legacy-peer-deps
```

Then add function `lessResourceLoader` to function `cssLoaders` in file `/build/utils.js`:

```json
function lessResourceLoader() {
    var loaders = [
      cssLoader,
      'less-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, '../src/assets/styles/common.less'),
          ]
        }
      }
    ];
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }
```

Finally, modify function `cssLoaders` return item `less`:

```json
less: lessResourceLoader()
```

Now `src/assets/styles/common.js` becomes your global style file. 
