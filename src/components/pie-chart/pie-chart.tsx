import { Component, Prop, h, Element } from '@stencil/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  tag: 'pie-chart',
  styleUrl: 'pie-chart.css',
  shadow: false,
})
export class PieChartComponent {
  @Element() hostEl: HTMLElement;

  /** Array of items like: { category: string; monthly: number; dol?: number } */
  @Prop() data: any[] = [];

  /** "$" or "%" */
  @Prop() type: string = '$';

  /** dark/light mode */
  @Prop() dark: boolean = false;

  chart: am4charts.PieChart;

  componentDidLoad() {
    this.createPieChart();
  }

  disconnectedCallback() {
    if (this.chart) this.chart.dispose();
  }

  createPieChart() {
    am4core.useTheme(am4themes_animated);

    /** container fix */
    const chartContainer = this.hostEl.querySelector('.chart-container') as HTMLElement;

    /** Create chart safely */
    const chart = am4core.create(chartContainer, am4charts.PieChart) as am4charts.PieChart;
    chart.padding(0, 0, 0, 0);
    chart.margin(0, 0, 0, 0);

    /** exporting image quality */
    const png = chart.exporting.getFormatOptions('png');
    png.minWidth = 1000;
    png.minHeight = 1000;
    png.maxWidth = 2000;
    png.maxHeight = 2000;
    chart.exporting.setFormatOptions('png', png);

    /** set dataset */
    chart.data = this.data;
    chart.radius = am4core.percent(100);
    chart.innerRadius = am4core.percent(64);
    chart.responsive.enabled = true;

    /** series */
    const series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = 'monthly';
    series.dataFields.category = 'category';

    /** tooltip logic */
    if (this.type !== '$') {
      series.slices.template.tooltipText = `{category}: {value}%\n$ {dol}`;
    } else {
      series.slices.template.tooltipText = '{category}: ${value}';
    }

    /** disable outside ticks/labels */
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;

    /** colors */
    series.colors.list = [
      am4core.color('#3ab7a4'),
      am4core.color('#5e5ca9'),
      am4core.color('#D45159'),
      am4core.color('#f15a24'),
      am4core.color('#68ACA5'),
      am4core.color('#8c2b86'),
      am4core.color('#73c03c'),
      am4core.color('#ffb31f'),
      am4core.color('#68ACA5'),
    ];

    /** center label */
    const label = series.createChild(am4core.Label);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.fontSize = 22;
    label.fill = am4core.color(this.dark ? '#fff' : '#000');
    label.text = this.type === '$' ? '${values.value.sum}' : '';

    this.chart = chart;
  }

  render() {
    return <div class="chart-container"></div>;
  }
}
