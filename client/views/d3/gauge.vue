<template>
  <div>
    <div class='tile is-ancestor'>
      <div class='tile is-parent'>
        <article class='tile is-child box'>
          <h4 class='title'>Liquid Fill Gauge</h4>
          <div id='gauge'>
            <svg id='fillgauge1' width='97%' height='250' @click='newValue(1)'></svg>
            <svg id='fillgauge2' width='24%' height='200' @click='newValue(2)'></svg>
            <svg id='fillgauge3' width='24%' height='200' @click='newValue(3)'></svg>
            <svg id='fillgauge4' width='24%' height='200' @click='newValue(4)'></svg>
            <svg id='fillgauge5' width='24%' height='200' @click='newValue(5)'></svg>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import d3 from 'd3'

export default {
  mounted () {
    this.draw()
  },

  data () {
    return {
      g1: {},
      g2: {},
      g3: {},
      g4: {},
      g5: {}
    }
  },

  methods: {
    draw () {
      this.g1 = this.loadLiquidFillGauge('fillgauge1', 55, {
        minValue: 0,
        maxValue: 100,
        circleThickness: 0.05,
        circleFillGap: 0.05,
        circleColor: '#178BCA',
        waveHeight: 0.05,
        waveCount: 1,
        waveRiseTime: 1000,
        waveAnimateTime: 18000,
        waveRise: true,
        waveHeightScaling: true,
        waveAnimate: true,
        waveColor: '#178BCA',
        waveOffset: 0,
        textVertPosition: 0.5,
        textSize: 1,
        valueCountUp: true,
        displayPercent: true,
        textColor: '#045681',
        waveTextColor: '#A4DBf8'
      })

      this.g2 = this.loadLiquidFillGauge('fillgauge2', 28, {
        minValue: 0,
        maxValue: 100,
        circleThickness: 0.2,
        circleFillGap: 0.05,
        circleColor: '#FF7777',
        waveHeight: 0.05,
        waveCount: 1,
        waveRiseTime: 1000,
        waveAnimateTime: 1000,
        waveRise: true,
        waveHeightScaling: true,
        waveAnimate: true,
        waveColor: '#FFDDDD',
        waveOffset: 0,
        textVertPosition: 0.2,
        textSize: 1,
        valueCountUp: true,
        displayPercent: true,
        textColor: '#FF4444',
        waveTextColor: '#FFAAAA'
      })

      this.g3 = this.loadLiquidFillGauge('fillgauge3', 60.1, {
        minValue: 0,
        maxValue: 100,
        circleThickness: 0.1,
        circleFillGap: 0.2,
        circleColor: '#D4AB6A',
        waveHeight: 0.3,
        waveCount: 1,
        waveRiseTime: 1000,
        waveAnimateTime: 2000,
        waveRise: true,
        waveHeightScaling: true,
        waveAnimate: true,
        waveColor: '#AA7D39',
        waveOffset: 0,
        textVertPosition: 0.8,
        textSize: 1,
        valueCountUp: true,
        displayPercent: true,
        textColor: '#553300',
        waveTextColor: '#805615'
      })

      this.g4 = this.loadLiquidFillGauge('fillgauge4', 60.44, {
        minValue: 0,
        maxValue: 100,
        circleThickness: 0.15,
        circleFillGap: 0.2,
        circleColor: '#808015',
        waveHeight: 0.05,
        waveCount: 3,
        waveRiseTime: 1000,
        waveAnimateTime: 1000,
        waveRise: false,
        waveHeightScaling: false,
        waveAnimate: true,
        waveColor: '#AAAA39',
        waveOffset: 0.25,
        textVertPosition: 0.8,
        textSize: 0.75,
        valueCountUp: true,
        displayPercent: true,
        textColor: '#555500',
        waveTextColor: '#FFFFAA'
      })

      this.g5 = this.loadLiquidFillGauge('fillgauge5', 120, {
        minValue: 30,
        maxValue: 150,
        circleThickness: 0.4,
        circleFillGap: 0.05,
        circleColor: '#6DA398',
        waveHeight: 0,
        waveCount: 2,
        waveRiseTime: 1000,
        waveAnimateTime: 5000,
        waveRise: true,
        waveHeightScaling: true,
        waveAnimate: false,
        waveColor: '#246D5F',
        waveOffset: 0.25,
        textVertPosition: 0.52,
        textSize: 1.2,
        valueCountUp: true,
        displayPercent: false,
        textColor: '#0E5144',
        waveTextColor: '#6DA398'
      })
    },

    loadLiquidFillGauge (elementId, value, config) {
      let gauge = d3.select('#' + elementId)
      let radius = Math.min(parseInt(gauge.style('width')), parseInt(gauge.style('height')))/2
      let locationX = parseInt(gauge.style('width'))/2 - radius
      let locationY = parseInt(gauge.style('height'))/2 - radius
      let fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue

      var waveHeightScale
      if (config.waveHeightScaling) {
        waveHeightScale = d3.scale.linear()
          .range([0,config.waveHeight,0])
          .domain([0,50,100])
      } else {
        waveHeightScale = d3.scale.linear()
          .range([config.waveHeight,config.waveHeight])
          .domain([0,100])
      }

      let textPixels = (config.textSize * radius/2)
      let textFinalValue = parseFloat(value).toFixed(2)
      let textStartValue = config.valueCountUp?config.minValue:textFinalValue
      let percentText = config.displayPercent?'%':''
      let circleThickness = config.circleThickness * radius
      let circleFillGap = config.circleFillGap * radius
      let fillCircleMargin = circleThickness + circleFillGap
      let fillCircleRadius = radius - fillCircleMargin
      let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100)

      let waveLength = fillCircleRadius * 2/config.waveCount
      let waveClipCount = 1+config.waveCount
      let waveClipWidth = waveLength * waveClipCount

      // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
      let textRounder = function(value) { return Math.round(value) }
      if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
        textRounder = function(value) { return parseFloat(value).toFixed(1) }
      }
      if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
        textRounder = function(value) { return parseFloat(value).toFixed(2) }
      }

      // Data for building the clip wave area.
      let data = []
      for(let i = 0; i <= 40 * waveClipCount; i++) {
        data.push({x: i/(40 * waveClipCount), y: (i/(40))})
      }

      // Scales for drawing the outer circle.
      let gaugeCircleX = d3.scale.linear().range([0,2 * Math.PI]).domain([0,1])
      let gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius])

      // Scales for controlling the size of the clipping path.
      let waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1])
      let waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1])

      // Scales for controlling the position of the clipping path.
      let waveRiseScale = d3.scale.linear()
      // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
      // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
      // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius * 2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1])
      let waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
        .domain([0,1])

      // Scale for controlling the position of the text within the gauge.
      let textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius * 2,(fillCircleMargin+textPixels * 0.7)])
        .domain([0,1])

      // Center the gauge within the parent SVG.
      let gaugeGroup = gauge.append('g')
        .attr('transform', 'translate('+locationX+', '+locationY+')')

      // Draw the outer circle.
      let gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness))
      gaugeGroup.append('path')
        .attr('d', gaugeCircleArc)
        .style('fill', config.circleColor)
        .attr('transform', 'translate('+radius+', '+radius+')')

      // Text where the wave does not overlap.
      let text1 = gaugeGroup.append('text')
        .text(textRounder(textStartValue) + percentText)
        .attr('class', 'liquidFillGaugeText')
        .attr('text-anchor', 'middle')
        .attr('font-size', textPixels + 'px')
        .style('fill', config.textColor)
        .attr('transform', 'translate('+radius+', '+textRiseScaleY(config.textVertPosition)+')')

      // The clipping wave area.
      let clipArea = d3.svg.area()
        .x(function (d) { return waveScaleX(d.x) })
        .y0(function (d) { return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1-config.waveCount) + d.y * 2 * Math.PI))})
        .y1(function (d) { return (fillCircleRadius * 2 + waveHeight) })
      let waveGroup = gaugeGroup.append('defs')
        .append('clipPath')
        .attr('id', 'clipWave' + elementId)
      let wave = waveGroup.append('path')
        .datum(data)
        .attr('d', clipArea)
        .attr('T', 0)

      // The inner circle with the clipping wave attached.
      let fillCircleGroup = gaugeGroup.append('g')
        .attr('clip-path', 'url(#clipWave' + elementId + ')')
      fillCircleGroup.append('circle')
        .attr('cx', radius)
        .attr('cy', radius)
        .attr('r', fillCircleRadius)
        .style('fill', config.waveColor)

      // Text where the wave does overlap.
      let text2 = fillCircleGroup.append('text')
        .text(textRounder(textStartValue) + percentText)
        .attr('class', 'liquidFillGaugeText')
        .attr('text-anchor', 'middle')
        .attr('font-size', textPixels + 'px')
        .style('fill', config.waveTextColor)
        .attr('transform', 'translate('+radius+', '+textRiseScaleY(config.textVertPosition)+')')

      // Make the value count up.
      if (config.valueCountUp) {
        let textTween = function () {
          let i = d3.interpolate(this.textContent, textFinalValue)
          return function (t) { this.textContent = textRounder(i(t)) + percentText }
        }
        text1.transition()
          .duration(config.waveRiseTime)
          .tween('text', textTween)
        text2.transition()
          .duration(config.waveRiseTime)
          .tween('text', textTween)
      }

      // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
      let waveGroupXPosition = fillCircleMargin+fillCircleRadius * 2-waveClipWidth
      if (config.waveRise) {
        waveGroup.attr('transform', 'translate('+ waveGroupXPosition +', '+waveRiseScale(0)+')')
          .transition()
          .duration(config.waveRiseTime)
          .attr('transform', 'translate('+ waveGroupXPosition +', '+waveRiseScale(fillPercent)+')')
          .each('start', function () { wave.attr('transform', 'translate(1,0)') })
      } else {
        waveGroup.attr('transform', 'translate('+ waveGroupXPosition +', '+waveRiseScale(fillPercent)+')')
      }

      if (config.waveAnimate) animateWave()

      function animateWave() {
        wave.attr('transform', 'translate('+waveAnimateScale(wave.attr('T'))+',0)')
        wave.transition()
          .duration(config.waveAnimateTime * (1 - wave.attr('T')))
          .ease('linear')
          .attr('transform', 'translate('+waveAnimateScale(1)+',0)')
          .attr('T', 1)
          .each('end', function () {
            wave.attr('T', 0)
            animateWave(config.waveAnimateTime)
          })
      }

      function GaugeUpdater() {
        this.update = function(value) {
          let newFinalValue = parseFloat(value).toFixed(2)
          let textRounderUpdater = function(value) { return Math.round(value) }
          if (parseFloat(newFinalValue) !== parseFloat(textRounderUpdater(newFinalValue))) {
            textRounderUpdater = function(value) { return parseFloat(value).toFixed(1) }
          }
          if (parseFloat(newFinalValue) !== parseFloat(textRounderUpdater(newFinalValue))) {
            textRounderUpdater = function (value) { return parseFloat(value).toFixed(2) }
          }

          let textTween = function () {
            let i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2))
            return function (t) { this.textContent = textRounderUpdater(i(t)) + percentText }
          }

          text1.transition()
            .duration(config.waveRiseTime)
            .tween('text', textTween)
          text2.transition()
            .duration(config.waveRiseTime)
            .tween('text', textTween)

          let fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue
          let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100)
          let waveRiseScale = d3.scale.linear()
          // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
          // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
          // circle at 100%.
            .range([(fillCircleMargin+fillCircleRadius * 2+waveHeight),(fillCircleMargin-waveHeight)])
            .domain([0,1])
          let newHeight = waveRiseScale(fillPercent)
          let waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1])
          let waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1])
          let newClipArea
          if (config.waveHeightScaling) {
            newClipArea = d3.svg.area()
              .x(function (d) { return waveScaleX(d.x) })
              .y0(function (d) { return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1-config.waveCount) + d.y * 2 * Math.PI))})
              .y1(function (d) { return (fillCircleRadius * 2 + waveHeight) })
          } else {
            newClipArea = clipArea
          }

          let newWavePosition = config.waveAnimate ? waveAnimateScale(1):0
          wave.transition()
            .duration(0)
            .transition()
            .duration(config.waveAnimate ? (config.waveAnimateTime * (1 - wave.attr('T'))):(config.waveRiseTime))
            .ease('linear')
            .attr('d', newClipArea)
            .attr('transform', 'translate('+ newWavePosition +', 0)')
            .attr('T', '1')
            .each('end', function () {
              if (config.waveAnimate) {
                wave.attr('transform', 'translate(' + waveAnimateScale(0) + ', 0)')
                animateWave(config.waveAnimateTime)
              }
            })
          waveGroup.transition()
            .duration(config.waveRiseTime)
            .attr('transform', 'translate(' + waveGroupXPosition + ', ' + newHeight + ')')
        }
      }

      return new GaugeUpdater()
    },

    newValue (num) {
      const random = () => {
        if (Math.random() > 0.5) {
          return Math.round(Math.random() * 100)
        } else {
          return (Math.random() * 100).toFixed(1)
        }
      }
      this['g' + num].update(random())
    }
  }
}
</script>

<style lang='scss'>
#tree {
  position: relative;
  width: 960px;
  margin: 0 auto;

  .node {
    cursor: pointer;
  }

  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 1.5px;
  }

  .node text {
    font: 10px sans-serif;
  }

  .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
  }
}
</style>
