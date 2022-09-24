import HelloWorld from '@/components/HelloWorld'
import Statistics from '@/components/Statistics.vue'
import Notice from '@/components/Notice.vue'
import Feedback from '@/components/Feedback.vue'
import ContactsCheck from '@/components/ContactsCheck.vue'
import RegionsSearch from '@/components/RegionsSearch.vue'
const urls = require('@/utils/urls')

export default [
  {
    path: '/',
    component: HelloWorld,
    children: [
      {
        path: '/',
        name: 'Statistics',
        displayName: '实时数据',
        component: Statistics,
        alias: 'statistics',
        props: {
          get: urls.statistics,
        },
      },
      {
        path: '/notice',
        name: 'Notice',
        displayName: '通知公告',
        component: Notice,
        props: {
          get: urls.notice,
        },
      },
      {
        path: '/contactsCheck',
        name: 'ContactsCheck',
        displayName: '接触者自查',
        component: ContactsCheck,
        props: {
          post: urls.contactsCheck,
        },
      },
      {
        path: '/regionsSearch',
        name: 'RegionsSearch',
        displayName: '风险区域检索',
        component: RegionsSearch,
        props: {
          post: urls.regionsSearch,
        },
      },
      {
        path: '/feedback',
        name: 'Feedback',
        displayName: '反馈',
        component: Feedback,
        props: {
          post: urls.feedback,
        },
      },
    ],
  },
]
