'use strict';

import {Component} from 'react'
import PropTypes from 'prop-types'
import {Chart} from 'react-google-charts'
import {getSupply} from '../utils/supply'

class SupplyNumberChart extends Component {
  static propTypes: {
    id: PropTypes.string.isRequired,
    years: PropTypes.number.isRequired,
    chartHeight: PropTypes.number.isRequired,
    isStacked: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      width: 0,
      height: 0,
      loaded: false,
      options: {
        title: 'Blockstack supply over time',
        hAxis: {
          title: 'Years',
          minValue: 0,
          maxValue: this.props.years
        },
        vAxis: {
          title: '# of tokens',
          format: '#,###M'
        },
        seriesType: 'area',
        legend: {
          position: 'top',
          maxLines: 2,
        },
        isStacked: this.props.isStacked,
        chartArea: {
          left: '15%',
          top: '15%',
          width:'75%',
          height:'75%'
        },
        colors: ['#F44336', '#673AB7', '#4CAF50', '#03A9F4', '#FFC107', '#3F51B5'],
      },
      data: null,
    }
    this.rebuildChartData = this.rebuildChartData.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  componentDidMount() {
    this.rebuildChartData()
    window.addEventListener('resize', this.updateDimensions)
  }

  componentDidUpdate(prevProps, /*prevState*/) {
    if (prevProps.years !== this.props.years) {
      this.rebuildChartData()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  rebuildChartData() {
    const years = this.props.years

    let data = [
      ['Years', 'Miners', 'Apps', 'User Rewards', 'User Sale', 'Accredited Sale', 'Creators',],
    ]

    for (let i = 0; i <= years; i++) {
      const supplyObject = getSupply('blockstack', i)
      const row = [
        i,
        supplyObject.miners/Math.pow(10, 6),
        supplyObject.apps/Math.pow(10, 6),
        supplyObject.userMining/Math.pow(10, 6),
        supplyObject.userSale/Math.pow(10, 6),
        supplyObject.creators/Math.pow(10, 6),
        supplyObject.sale/Math.pow(10, 6),
      ]
      data.push(row)
    }
    let options = this.state.options
    options.hAxis.maxValue = years
    this.setState({
      loaded: true,
      data: data,
      options: options
    })
  }

  updateDimensions() {
    this.setState({
      width: $(`#${this.props.id}`).width(), 
      height: $(`#${this.props.id}`).height(),
    })
  }

  render() {
    return (
      <div id={this.props.id} className="chart-panel">
        {this.state.data ?
        <Chart
          chartType="ComboChart"
          data={this.state.data}
          options={this.state.options}
          graph_id={this.props.id}
          width={'100%'}
          height={this.props.chartHeight}
          legend_toggle
        />
        : null }
      </div>
    )
  }

}

export default SupplyNumberChart

