<template>
  <div>
    <div class='tile is-ancestor'>
      <div class='tile is-parent is-6'>
        <article class='tile is-child box'>
          <h4 class="title">Visual Node</h4>
          <div id="canvasVisual" class="canvas"></div>
        </article>
      </div>
      <div class='tile is-parent is-6'>
        <article class='tile is-child box'>
          <h4 class="title">Cose Layout</h4>
          <div id="canvasCose" class="canvas"></div>
        </article>
      </div>
    </div>
    <div class='tile is-ancestor'>
      <div class='tile is-parent is-6'>
        <article class='tile is-child box'>
          <h4 class="title">Cose Bilkent Layout</h4>
          <div id="canvasBilkent" class="canvas"></div>
        </article>
      </div>
      <div class='tile is-parent is-6'>
        <article class='tile is-child box'>
          <h4 class="title">Labels Style</h4>
          <div id="canvasLabels" class="canvas"></div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import cytoscape from 'cytoscape'
import regCose from 'cytoscape-cose-bilkent'

export default {
  created () {
    Promise.all([
      fetch('http://js.cytoscape.org/demos/cose-layout/cy-style.json')
        .then(function (res) {
          return res.json()
        }),
      fetch('http://js.cytoscape.org/demos/cose-layout/data.json')
        .then(function (res) {
          return res.json()
        })
    ]).then(this.drawCose)
    fetch('http://js.cytoscape.org/demos/labels/cy-style.json')
      .then(function (res) {
        return res.json()
      }).then(this.drawLabels)
    fetch('http://js.cytoscape.org/demos/cose-bilkent-layout/data.json')
      .then(function (res) {
        return res.json()
      }).then(this.drawBilkent)
  },

  mounted () {
    regCose(cytoscape)
    this.drawVisual()
  },

  methods: {
    drawVisual () {
      cytoscape({
        container: document.getElementById('canvasVisual'),
        userZoomingEnabled: false,
        layout: {
          name: 'cose',
          padding: 10
        },

        style: cytoscape.stylesheet()
          .selector('node')
          .css({
            'shape': 'data(faveShape)',
            'width': 'mapData(weight, 40, 80, 20, 60)',
            'content': 'data(name)',
            'text-valign': 'center',
            'text-outline-width': 2,
            'text-outline-color': 'data(faveColor)',
            'background-color': 'data(faveColor)',
            'color': '#fff'
          })
          .selector(':selected')
          .css({
            'border-width': 3,
            'border-color': '#333'
          })
          .selector('edge')
          .css({
            'curve-style': 'bezier',
            'opacity': 0.666,
            'width': 'mapData(strength, 70, 100, 2, 6)',
            'target-arrow-shape': 'triangle',
            'source-arrow-shape': 'circle',
            'line-color': 'data(faveColor)',
            'source-arrow-color': 'data(faveColor)',
            'target-arrow-color': 'data(faveColor)'
          })
          .selector('edge.questionable')
          .css({
            'line-style': 'dotted',
            'target-arrow-shape': 'diamond'
          })
          .selector('.faded')
          .css({
            'opacity': 0.25,
            'text-opacity': 0
          }),

        elements: {
          nodes: [
            { data: { id: 'j', name: 'Jerry', weight: 65, faveColor: '#6FB1FC', faveShape: 'triangle' } },
            { data: { id: 'e', name: 'Elaine', weight: 45, faveColor: '#EDA1ED', faveShape: 'ellipse' } },
            { data: { id: 'k', name: 'Kramer', weight: 75, faveColor: '#86B342', faveShape: 'octagon' } },
            { data: { id: 'g', name: 'George', weight: 70, faveColor: '#F5A45D', faveShape: 'rectangle' } }
          ],
          edges: [
            { data: { source: 'j', target: 'e', faveColor: '#6FB1FC', strength: 90 } },
            { data: { source: 'j', target: 'k', faveColor: '#6FB1FC', strength: 70 } },
            { data: { source: 'j', target: 'g', faveColor: '#6FB1FC', strength: 80 } },

            { data: { source: 'e', target: 'j', faveColor: '#EDA1ED', strength: 95 } },
            { data: { source: 'e', target: 'k', faveColor: '#EDA1ED', strength: 60 }, classes: 'questionable' },

            { data: { source: 'k', target: 'j', faveColor: '#86B342', strength: 100 } },
            { data: { source: 'k', target: 'e', faveColor: '#86B342', strength: 100 } },
            { data: { source: 'k', target: 'g', faveColor: '#86B342', strength: 100 } },

            { data: { source: 'g', target: 'j', faveColor: '#F5A45D', strength: 90 } }
          ]
        }
      })
    },

    drawCose (data) {
      cytoscape({
        container: document.getElementById('canvasCose'),
        userZoomingEnabled: false,
        layout: {
          name: 'cose',
          idealEdgeLength: 100,
          nodeOverlap: 20
        },
        style: data[0],
        elements: data[1]
      })
    },

    drawBilkent (data) {
      cytoscape({
        container: document.getElementById('canvasBilkent'),
        userZoomingEnabled: false,
        boxSelectionEnabled: false,
        autounselectify: true,

        layout: {
          name: 'cose-bilkent',
          animate: false
        },

        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#ad1a66'
            }
          },

          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#ad1a66'
            }
          }
        ],

        elements: data
      })
    },

    drawLabels (style) {
      style[0].style.width = 30
      style[0].style.height = 30
      style[0].style['background-color'] = '#399bff'

      cytoscape({
        container: document.getElementById('canvasLabels'),
        userZoomingEnabled: false,
        boxSelectionEnabled: false,
        autounselectify: true,

        layout: {
          name: 'grid',
          cols: 3
        },

        style: style,

        elements: [
          { data: { label: 'top left' }, classes: 'top-left' },
          { data: { label: 'top center' }, classes: 'top-center' },
          { data: { label: 'top right' }, classes: 'top-right' },

          { data: { label: 'center left' }, classes: 'center-left' },
          { data: { label: 'center center' }, classes: 'center-center' },
          { data: { label: 'center right' }, classes: 'center-right' },

          { data: { label: 'bottom left' }, classes: 'bottom-left' },
          { data: { label: 'bottom center' }, classes: 'bottom-center' },
          { data: { label: 'bottom right' }, classes: 'bottom-right' },

          { data: { label: 'multiline manual\nfoo\nbar' }, classes: 'multiline-manual' },
          { data: { label: 'multiline auto foo bar' }, classes: 'multiline-auto' },
          { data: { label: 'outline' }, classes: 'outline' },

          { data: { id: 'ar-src' } },
          { data: { id: 'ar-tgt' } },
          { data: { source: 'ar-src', target: 'ar-tgt', label: 'autorotate (move my nodes)' }, classes: 'autorotate' },
          { data: { label: 'background' }, classes: 'background' }
        ]
      })
    }
  }
}
</script>


<style lang='scss'>
.canvas {
  position: relative;
  width: 100%;
  height: 500px;
}
</style>
