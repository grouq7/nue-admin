<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title">Stick & Point</h4>
          <div ref="pen"></div>
        </article>
      </div>
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title">Animation Zoom</h4>
          <a class="button is-primary is-outlined clickZoom" @click="actionZoom">Click Zoom</a>
          <div ref="zoom"></div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-7">
        <article class="tile is-child box">
          <h4 class="title">Gap minder</h4>
          <div ref="graph"></div>
        </article>
      </div>
      <div class="tile is-parent is-5">
        <article class="tile is-child box">
          <h4 class="title">3D Surface</h4>
          <div ref="surface"></div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">Map</h4>
          <div ref="map"></div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Plotly from 'plotly.js'

export default {

  created () {
    this.fetchData()
  },

  mounted () {
    this.drawPen()
    this.drawZoom()
  },

  data () {
    return {
      rows: []
    }
  },

  methods: {
    getRandom (num, mul) {
      let value = []
      for (let i = 0; i <= num; i++) {
        value.push(Math.random() * mul)
      }
      return value
    },

    actionZoom () {
      let min = 0.45 * Math.random()
      let max = 0.55 + 0.45 * Math.random()
      Plotly.animate(this.$refs.zoom, {
        layout: {
          xaxis: {range: [min, max]},
          yaxis: {range: [min, max]}
        }
      }, {
        transition: {
          duration: 500,
          easing: 'cubic-in-out'
        }
      })
    },

    fetchData () {
      Plotly.d3.json('https://rawgit.com/plotly/documentation/cf89fd13f7db46d0203cf1f8236993bfbf9f80df/_posts/plotly_js/animations/gapminder-with-frames.json', (err, data) => {
        if (err) {
          data = {}
        }
        this.drawGapMinder(data)
      })

      Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv', (err, rows) => {
        if (err) {
          rows = []
        }
        this.drawSurface(rows)
      })

      Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/2014_us_cities.csv', (err, rows) => {
        if (err) {
          rows = []
        }
        this.drawMap(rows)
      })
    },

    drawGapMinder (data) {
      data.config.displayModeBar = false
      data.layout.margin = {
        l: 100, b: 10, r: 10, t: 0
      }
      Plotly.plot(this.$refs.graph, data)
    },

    drawSurface (rows) {
      let zdata = []
      for (let i = 0; i < 24; i++) {
        zdata.push(rows.map(row => row[i]))
      }

      let data = [{
        z: zdata,
        type: 'surface'
      }]

      let layout = {
        autosize: true,
        height: 400,
        margin: { l: 0, r: 0, b: 0, t: 0 }
      }
      Plotly.newPlot(this.$refs.surface, data, layout, { displayModeBar: false })
    },

    drawPen () {
      let yData = [
        this.getRandom(30, 10),
        this.getRandom(30, 20),
        this.getRandom(30, 25),
        this.getRandom(30, 40),
        this.getRandom(30, 45),
        this.getRandom(30, 30),
        this.getRandom(30, 20),
        this.getRandom(30, 15),
        this.getRandom(30, 43)
      ]
      let xData = yData.map((e, i) => `Player ${i + 1}`)

      let data = yData.map((e, i) => {
        return {
          type: 'box',
          y: e,
          name: xData[i],
          boxpoints: 'all',
          jitter: 0.5,
          whiskerwidth: 0.2,
          fillcolor: 'cls',
          marker: {size: 2},
          line: {width: 1}
        }
      })

      let layout = {
        title: 'Pen data Example',
        yaxis: {
          autorange: true,
          showgrid: true,
          zeroline: true,
          dtick: 5,
          gridwidth: 1,
          zerolinewidth: 2
        },
        margin: {l: 40, r: 40, b: 60, t: 40},
        showlegend: false
      }

      Plotly.newPlot(this.$refs.pen, data, layout, {displayModeBar: false})
    },

    drawZoom () {
      let n = 500
      let x = []
      let y = []
      for (let i = 0; i < n; i++) {
        x[i] = i / (n - 1)
        y[i] = x[i] + 0.2 * (Math.random() - 0.5)
      }
      let data = [{x: x, y: y, mode: 'markers'}]
      let layout = {
        xaxis: {range: [0, 1]},
        yaxis: {range: [0, 1]}
      }
      Plotly.plot(this.$refs.zoom, data, layout, {displayModeBar: false})
    },

    drawMap (rows) {
      let cityName = rows.map(row => row['name'])
      let cityPop = rows.map(row => row['pop'])
      let citySize = []
      let hoverText = []
      let scale = 50000

      cityPop.forEach((e, i) => {
        citySize.push(e / scale)
        hoverText.push(`${cityName[i]} pop: ${e}`)
      })

      let data = [{
        type: 'scattergeo',
        locationmode: 'USA-states',
        lat: rows.map(row => row['lat']),
        lon: rows.map(row => row['lon']),
        hoverinfo: 'text',
        text: hoverText,
        marker: {
          size: citySize,
          line: {color: 'black', width: 2}
        }
      }]

      let layout = {
        title: '2014 US City Populations',
        showlegend: false,
        margin: {t: 0, l: 0, b: 0, r: 0},
        geo: {
          scope: 'usa',
          projection: {
            type: 'albers usa'
          },
          showland: true,
          landcolor: 'rgb(217, 217, 217)',
          subunitwidth: 1,
          countrywidth: 1,
          subunitcolor: 'rgb(255,255,255)',
          countrycolor: 'rgb(255,255,255)'
        }
      }
      Plotly.plot(this.$refs.map, data, layout, { displayModeBar: false, showLink: false })
    }
  }
}
</script>

<style scoped>
.clickZoom {
  position: absolute;
  z-index: 1000
}
</style>
