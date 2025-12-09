import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'spendid-gauge',
  styleUrl: 'spendid-gauge.css',
  shadow: true,
})
export class SpendidGauge {
  @Prop() value: number = 0;
  @Prop() max: number = 100;

  render() {
    const percentage = (this.value / this.max) * 100;

    return (
      <div class="gauge-container">
        <svg class="gauge-svg" viewBox="0 0 100 100">
          <circle class="gauge-track" cx="50" cy="50" r="45" />
          <circle class="gauge-progress" cx="50" cy="50" r="45" style={{ strokeDashoffset: `${282.6 - (282.6 * percentage) / 100}px` }} />
        </svg>

        <div class="gauge-center">
          <div class="main-value">{this.value}</div>
          <div class="sub-value">/{this.max}</div>
        </div>
      </div>
    );
  }
}
