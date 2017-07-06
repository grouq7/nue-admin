import lazyLoading from './lazyLoading'

export default {
  name: 'Charts',
  path: '/charts',
  meta: {
    icon: 'fa-bar-chart-o',
    expanded: false,
    link: 'charts/index.vue'
  },
  component: lazyLoading('charts', true),

  children: [
    {
      name: 'Chartjs',
      path: 'chartjs',
      component: lazyLoading('charts/Chartjs'),
      meta: {
        link: 'charts/Chartjs.vue'
      }
    },
    {
      name: 'Peity',
      path: 'peity',
      component: lazyLoading('charts/Peity'),
      meta: {
        link: 'charts/Peity.vue'
      }
    },
    {
      name: 'Plotly',
      path: 'plotly',
      component: lazyLoading('charts/Plotly'),
      meta: {
        link: 'charts/Plotly.vue'
      }
    },
    {
      name: 'D3',
      path: 'd3',
      component: lazyLoading('charts/d3'),
      meta: {
        link: 'charts/d3.vue'
      }
    }
  ]
}
