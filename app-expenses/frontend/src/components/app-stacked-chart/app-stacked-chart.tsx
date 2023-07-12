import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { Expense } from '../../interfaces/expense';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';

@Component({
  tag: 'app-stacked-chart',
  styleUrl: 'app-stacked-chart.css',
  shadow: true,
})
export class ChartContainer {
  @Prop()
  data: Expense[];

  @Watch('data')
  dataWatcher(newData: Expense[]): void {
    const res = newData.map(item => ({ x: Date.parse(item.date), y: item.amount })).sort((a, b) => a.x - b.x);
    const value = res;
    this.myChartInstance.data.datasets.forEach((dataset: any) => {
      dataset.data = value;
    });

    this.myChartInstance.update();
  }

  @Element()
  private el: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  myChartRef: any;
  myChart: any;
  myChartInstance: any;
  constructor() {
    Chart.register(...registerables);
  }

  componentDidLoad(): void {
    this.initChart();
  }

  private initChart() {
    this.canvas = this.el.shadowRoot.querySelector('canvas');
    this.context = this.canvas.getContext('2d');

    const chartOptions: any = {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Monthly Expenses',
            data: [],
            backgroundColor: [
              'rgba(255, 26, 104, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(0, 0, 0, 0.2)',
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        animation: {
          duration: 200,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              round: 'month',
            },
          },
          y: { beginAtZero: true },
        },
      },
    };

    this.myChartInstance = new Chart(this.context, chartOptions);
  }

  render() {
    return (
      <div class={'chart-сontainer' + (this.data.length > 0 ? '' : ' hidden')}>
        <canvas width="400" height="300" />
      </div>
    );
  }
}
