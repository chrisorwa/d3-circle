
import * as d3 from 'd3'

/**
 * Default config.
 */

const defaults = {
  // target element or selector to contain the svg
  target: '#chart',

  // radius
  radius: 50,

  // thickness
  thickness: 5,

  // label formatter
  format: d3.format('.0%'),

  // easing function
  ease: 'easeLinear',

  // transition duration
  duration: 300
}

/**
 * Arc tween.
 */

const tween = arc => {
  return (path, angle) => {
    path.attrTween('d', d => {
      const i = d3.interpolate(d.endAngle, angle)
      return t => {
        d.endAngle = i(t)
        return arc(d)
      }
    })
  }
}

/**
 * CircleChart.
 */

export default class CircleChart {

  /**
   * Construct with the given `config`.
   */

  constructor(config) {
    this.set(config)
    this.init()
  }

  /**
   * Set configuration options.
   */

  set(config) {
    Object.assign(this, defaults, config)
  }

  /**
   * Initialize the chart.
   */

  init() {
    const { target, radius, thickness } = this

    const chart = d3.select(target)
        .attr('width', radius*2)
        .attr('height', radius*2)
      .append('g')
        .attr('transform', `translate(${radius}, ${radius})`)

    this.arc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0)

    this.bg = chart.append('path')
      .datum({ endAngle: 2 * Math.PI  })
      .attr('class', 'circle background')
      .attr('d', this.arc)

    this.fg = chart.append('path')
      .datum({ endAngle: 0 })
      .attr('class', 'circle foreground')
      .attr('d', this.arc)

    this.label = chart.append('text')
      .attr('class', 'label')
      .attr('x', 2)
      .attr('y', 2)
  }

  /**
   * Render the chart against the given `data`.
   */

  render(data, options = {}) {
    const { format, ease, duration } = this

    this.fg.transition()
      .duration(duration)
      .ease(d3[ease])
      .call(tween(this.arc), (2 * Math.PI) * data.value)

    this.label.text(format(data.value))
  }

  /**
   * Update the chart against the given `data`.
   */

  update(data) {
    this.render(data)
  }
}
