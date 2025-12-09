import { Component, h, Prop } from '@stencil/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  tag: 'budget-score-card',
  styleUrl: 'budget-score-card.css',
  shadow: false,
})
export class BudgetScoreCard {
  @Prop() score: number = 88;
  @Prop() peerScore: number = 70;

  private chart: am4charts.GaugeChart;
  private gaugeEl!: HTMLDivElement;

  componentDidLoad() {
    am4core.useTheme(am4themes_animated);

    // IMPORTANT — DO NOT USE ID
    let chart = am4core.create(this.gaugeEl, am4charts.GaugeChart);
    this.chart = chart;

    chart.innerRadius = -20;

    let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = 0;
    axis.max = 10;
    axis.strictMinMax = true;

    axis.renderer.radius = am4core.percent(100);
    axis.renderer.line.strokeWidth = 10;
    axis.renderer.line.strokeOpacity = 0;

    let gradient = new am4core.LinearGradient();
    gradient.addColor(am4core.color('#ff4b4b'));
    gradient.addColor(am4core.color('#1bcab8'));

    axis.renderer.axisFills.template.fill = gradient;
    axis.renderer.axisFills.template.fillOpacity = 1;

    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.value = Math.max(0, Math.min(10, this.score / 10));
    hand.fill = am4core.color('#C6FF00');
    hand.stroke = am4core.color('#C6FF00');
    hand.radius = am4core.percent(90);
    hand.innerRadius = am4core.percent(30);
    hand.pin.disabled = true;
  }

  disconnectedCallback() {
    if (this.chart) this.chart.dispose();
  }

  render() {
    return (
      <div class="card-container">
        <div class="header">
          <span>Your Budget Health Score</span>
          <span class="help-icon">?</span>
        </div>

        <div class="content-box">
          <div class="gauge-box">
            <div class="gauge" ref={el => (this.gaugeEl = el as HTMLDivElement)}></div>
            <div class="axis-labels">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          <div class="peer-box">
            <div class="peer-title">Peer's Score =</div>
            <div class="peer-value">{this.peerScore}</div>
          </div>
        </div>

        <div class="bottom-box">
          <img src="assets/wave-icon.svg" class="wave-icon" />
          <div class="score-value">{this.score}</div>
        </div>
      </div>
    );
  }
}
