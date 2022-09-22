// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MyCard from '@/components/MyCard.vue'
import {
  Container,
  Header,
  Aside,
  Main,
  Row,
  Col,
  Message,
  Icon,
  Table,
  TableColumn,
  Collapse,
  CollapseItem,
  Tag,
  Link,
  Form,
  FormItem,
  Input,
  Button,
  DatePicker,
  Dialog,
  MessageBox,
  Autocomplete,
  Notification,
  Menu,
  MenuItem,
} from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tag)
Vue.use(Link)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Menu)
Vue.use(MenuItem)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification

Vue.component('my-card', MyCard)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: (h) => h(App),
})
