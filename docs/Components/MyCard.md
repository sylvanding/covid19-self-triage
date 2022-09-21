# MyCard

We follow the design principle: **use components in Element UI only when involving data object corresponding**. The reason is that components provided by Element UI show a bad customization ability, for which we design the component `MyCard` to beautify our page. 

`MyCard` provides a beautiful card container, serving as the basement of the following components.

## Usage

After globally registering `MyCard`, you can use `<my-card>` in any Vue template: 

```html
<template>
  <el-row>
    <my-card span="24" color="orange">
      <template #header>
        <span>Card Header Here</span>
      </template>
      <div>Main content</div>
    </my-card>
  </el-row>
</template>
```

Referring `el-card`, we define a named slot for card head and an unnamed for card body. Make sure to assign the slot name when expecting to have a card head. Besides, you can set `span` attribute on `<mycard>`, which will be passed to its child component: 

```vue
// src/components/MyCard.vue

<template>
  <el-col :span="span | parseInt">
    <div :class="['my-card', color]">
      <div class="my-card-header">
        <slot name="header"></slot>
      </div>
      <div class="my-card-body">
        <slot></slot>
      </div>
    </div>
  </el-col>
</template>

<script>
export default {
  name: 'MyCard',
  props: {
    span: {
      default: 24,
    },
    color: {
      type: String,
      default: 'blue',
    },
  },
  filters: {
    parseInt: (value) => parseInt(value),
  },
}
</script>

<style lang="less">
@import '../assets/styles/my-card';
</style>
```

## Attributes

| Attribute | Description                     | Type   | Options                    | Default |
| --------- | ------------------------------- | ------ | -------------------------- | ------- |
| span      | number of column the grid spans | number | -                          | 24      |
| color     | color of the card head          | string | blue/red/cyan/orange/berry | blue    |
