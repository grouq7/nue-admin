<template>
  <div>
    <div class='tile is-ancestor'>
      <div class='tile is-parent'>
        <article class='tile is-child box'>
          <h1 class="title">Default</h1>
          <div class="columns">
            <div class="column">
              <div id="canvas1" class="canvas"></div>
            </div>
            <div class="column">
              <div id="canvas2" class="canvas"></div>
            </div>
            <div class="column">
              <div id="canvas3" class="canvas"></div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h1 class="title">NetworkX</h1>
          <div class="columns">
            <div class="column">
              <div id="canvasN1" class="canvas"></div>
            </div>
            <div class="column">
              <div id="canvasN2" class="canvas"></div>
            </div>
            <div class="column">
              <div id="canvasN3" class="canvas"></div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import d3 from 'd3'
const jsnx = require('../../lib/jsnetworkx')
const color = d3.scale.category10()

export default {
  mounted () {
    this.drawDefault()
    this.drawNetWork()
  },

  methods: {
    getRandom (min, max) {
      return Math.floor((Math.random() * (max - min + 1)) + min)
    },

    drawDefault () {
      const G1 = new jsnx.Graph()
      G1.addWeightedEdgesFrom([[2, 3, 10]])
      G1.addStar([3, 4, 5, 6], {weight: 5})
      G1.addStar([2, 1, 0, -1], {weight: 3})
      jsnx.draw(G1, {
        element: '#canvas1',
        weighted: true,
        edgeStyle: {
          'stroke-width': 10
        }
      })

      const G2 = new jsnx.DiGraph()
      G2.addNodesFrom([1, 2, 3, 4, 5, [9, {color: '#008A00'}]], {color: '#0064C7'})
      G2.addCycle([1, 2, 3, 4, 5])
      G2.addEdgesFrom([[1, 9], [9, 1]])

      jsnx.draw(G2, {
        element: '#canvas2',
        withLabels: true,
        nodeStyle: {
          fill: function (d) {
            return d.data.color
          }
        },
        labelStyle: {fill: 'white'},
        stickyDrag: true
      })

      const G3 = new jsnx.Graph()
      G3.addNodesFrom([1, 2, 3, 4], {group: 0})
      G3.addNodesFrom([5, 6, 7], {group: 1})
      G3.addNodesFrom([8, 9, 10, 11], {group: 2})
      G3.addPath([1, 2, 5, 6, 7, 8, 11])
      G3.addEdgesFrom([[1, 3], [1, 4], [3, 4], [2, 3], [2, 4], [8, 9], [8, 10], [9, 10], [11, 10], [11, 9]])

      var color = d3.scale.category20()
      jsnx.draw(G3, {
        element: '#canvas3',
        layoutAttr: {
          charge: -120,
          linkDistance: 20
        },
        nodeAttr: {
          r: 5,
          title: function (d) { return d.label }
        },
        nodeStyle: {
          fill: function (d) {
            return color(d.data.group)
          },
          stroke: 'none'
        },
        edgeStyle: {
          fill: '#999'
        }
      })
    },

    drawNetWork () {
      const Gn1 = jsnx.grid2dGraph(5, 5)
      jsnx.draw(Gn1, {
        element: '#canvasN1',
        layoutAttr: {
          charge: -300,
          linkDistance: 20,
          gravity: 0.5
        },
        panZoom: {
          enabled: false
        },
        nodeAttr: {
          r: 6,
          title: function (d) { return d.label }
        },
        nodeStyle: {
          fill: function (d) { return color(d.node % 4) },
          stroke: 'none'
        },
        edgeStyle: {
          fill: '#999'
        }
      })

      const Gn2 = jsnx.karateClubGraph()
      jsnx.draw(Gn2, {
        element: '#canvasN2',
        layoutAttr: {
          charge: -400,
          linkDistance: 60,
          gravity: 0.5
        },
        panZoom: {
          enabled: false
        },
        nodeAttr: {
          r: 6,
          title: function (d) { return d.label }
        },
        nodeStyle: {
          fill: function (d) { return color(d.node % 4) },
          stroke: 'none'
        },
        edgeStyle: {
          fill: '#999'
        }
      })

      const Gn3 = jsnx.completeGraph(8)
      jsnx.draw(Gn3, {
        element: '#canvasN3',
        layoutAttr: {
          charge: -120,
          linkDistance: 100,
          gravity: 0.5
        },
        panZoom: {
          enabled: false
        },
        nodeAttr: {
          r: 6,
          title: function (d) { return d.label }
        },
        nodeStyle: {
          fill: function (d) { return color(d.node % 4) },
          stroke: 'none'
        },
        edgeStyle: {
          fill: '#999'
        }
      })
    }
  }
}
</script>


<style lang='scss'>
.canvas {
  position: relative;
  width: 100%;
  height: 300px;
}
</style>
