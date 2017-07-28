import lazyLoading from './lazyLoading'

export default {
  name: 'D3',
  path: '/d3',
  meta: {
    icon: 'fa-share-alt',
    expanded: false,
    link: 'd3/index.vue'
  },
  component: lazyLoading('charts', true),

  children: [
    {
      name: 'JSNetworkX',
      path: 'jsnetworkx',
      component: lazyLoading('d3/jsnetworkx'),
      meta: {
        link: 'd3/jsnetworkx.vue'
      }
    },
    {
      name: 'Cytoscape',
      path: 'cytoscape',
      component: lazyLoading('d3/cytoscape'),
      meta: {
        link: 'd3/cytoscape.vue'
      }
    },
    {
      name: 'Hierarchical Edge',
      path: 'hierarchical',
      component: lazyLoading('d3/hierarchical'),
      meta: {
        link: 'd3/hierarchical.vue'
      }
    },
    {
      name: 'Collapsible Tree',
      path: 'tree',
      component: lazyLoading('d3/tree'),
      meta: {
        link: 'd3/tree.vue'
      }
    },
    {
      name: 'Animated Gauge',
      path: 'gauge',
      component: lazyLoading('d3/gauge'),
      meta: {
        link: 'd3/gauge.vue'
      }
    }
  ]
}
