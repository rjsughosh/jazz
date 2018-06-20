import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'chartjs-linegraph',
  templateUrl: './chartjs-linegraph.component.html',
  styleUrls: ['./chartjs-linegraph.component.scss']
})
export class ChartjsLinegraphComponent implements OnInit, OnChanges {
  @ViewChild('container') container;
  @ViewChild('linegraph') lineGraph;
  @Input() datasets = [];
  @Input() graphOptions = {};
  public type = 'scatter';
  public datasets: [];
  public options = {};
  constructor() {}

  ngOnInit() {
    this.sizeCanvas();
  }

  ngOnChanges(changes) {
    this.datasets = this.datasets.map(this.modifyDataSet);
    this.options = this.getOptions(this.graphOptions);
  }

  modifyDataSet(data) {
    let lineOptions = {
      data: data,
      borderColor: 'black',
      borderWidth: 1,
      pointBackgroundColor: ['#000', '#00bcd6', '#d300d6'],
      pointBorderColor: ['#000', '#00bcd6', '#d300d6'],
      pointRadius: 5,
      pointHoverRadius: 5,
      fill: false,
      tension: 0,
      showLine: true
    };
    return lineOptions;
  }

  getOptions(graphOptions) {
    let options = {
      responsive: false,
      legend: false,
      tooltips: false,
      scales: {
        xAxes: [
          {
            ticks: {
              min: 0,
              max: 100,
              stepSize: undefined,
              userCallback: function (tick) {
                return tick
              }
            },
            gridLines: {
              color: '#888',
              drawOnChartArea: false
            }
          }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            padding: 10
          },
          gridLines: {
            color: '#888',
            drawOnChartArea: true
          }
        }]
      }
    };
    options.scales.xAxes[0].ticks.min = graphOptions.fromDateValue;
    options.scales.xAxes[0].ticks.max = graphOptions.toDateValue;
    options.scales.xAxes[0].ticks.stepSize = graphOptions.stepSize;
    options.scales.xAxes[0].ticks.userCallback = (tick) => {
      return moment(tick).format(graphOptions.xAxisFormat)
    };
    return options;
  }

  sizeCanvas() {
    let boundingRect = this.container.nativeElement.getBoundingClientRect();
    this.lineGraph.nativeElement.height = boundingRect.height;
    this.lineGraph.nativeElement.width = boundingRect.width;
  }

}
