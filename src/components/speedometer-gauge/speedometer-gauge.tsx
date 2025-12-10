import { Component, Prop, h, Element } from '@stencil/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  tag: 'speedometer-gauge',
  styleUrl: 'speedometer-gauge.css',
  shadow: false,
})
export class SpeedometerGauge {
  @Element() hostEl: HTMLElement;

  @Prop() value: number = 0;

  chart: am4charts.GaugeChart;

  componentDidLoad() {
    this.createSpeedChart();
  }

  createSpeedChart() {
    am4core.useTheme(am4themes_animated);

    /** FIX 1 — Force HTMLElement type */
    const chartContainer = this.hostEl.querySelector('.chart-container') as HTMLElement;

    /** FIX 2 — Create GaugeChart safely */
    const chart = am4core.create(chartContainer, am4charts.GaugeChart) as am4charts.GaugeChart;
    chart.innerRadius = am4core.percent(64);
    chart.startAngle = -180;
    chart.endAngle = 0;
    /** FIX 3 — Force correct ValueAxis type */
    const axis = chart.xAxes.push(new am4charts.ValueAxis() as am4charts.ValueAxis<am4charts.AxisRendererCircular>);

    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.labels.template.fontSize = '0.7em';
    axis.renderer.labels.template.fill = am4core.color('#fff');
    axis.renderer.minGridDistance = 500;

    /** Secondary axis with safe casting */
    const axis2 = chart.xAxes.push(new am4charts.ValueAxis() as am4charts.ValueAxis<am4charts.AxisRendererCircular>);

    axis2.min = 0;
    axis2.max = 100;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    /** Ranges */
    const rangeLeft = axis2.axisRanges.create();
    rangeLeft.value = 0;
    rangeLeft.endValue = 50;

    const gradientLeft = new am4core.LinearGradient();
    gradientLeft.addColor(am4core.color('#ff0000'));
    gradientLeft.addColor(am4core.color('#5868eb'));
    rangeLeft.axisFill.fill = gradientLeft;
    rangeLeft.axisFill.fillOpacity = 1;

    const rangeRight = axis2.axisRanges.create();
    rangeRight.value = 50;
    rangeRight.endValue = 100;

    const gradientRight = new am4core.LinearGradient();
    gradientRight.addColor(am4core.color('#5868eb'));
    gradientRight.addColor(am4core.color('#68aca5'));
    rangeRight.axisFill.fill = gradientRight;
    rangeRight.axisFill.fillOpacity = 1;

    /** Label */
    const label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 30;
    label.text = `${this.value}`;
    label.fill = am4core.color('#fff');
    label.horizontalCenter = 'middle';
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);

    /** Hand pointer */
    const hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    // hand.value = this.value;
    hand.value = Math.max(0, Math.min(100, this.value));
    hand.fill = am4core.color('#a7ff83');
    hand.stroke = am4core.color('#a7ff83');

    this.chart = chart;
  }

  render() {
    return <div class="chart-container"></div>;
  }
}
