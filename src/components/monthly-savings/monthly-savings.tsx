import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'monthly-savings',
  styleUrl: 'monthly-savings.css',
  shadow: true,
})
export class MonthlySavings {
  @Prop() data: { label: string; value: number; color: string }[] = [
    { label: 'Savings 1', value: 13000, color: '#4B8E7D' },
    { label: 'Savings 2', value: 8000, color: '#88E6F9' },
  ];

  render() {
    const maxValue = Math.max(...this.data.map(d => d.value));
    const chartHeight = 150;
    return (
      <div class="chart-container">
        <div class="chart-area">
          <div class="y-axis">
            {[0, 4000, 8000, 12000, 16000].reverse().map(val => (
              <span class="y-label">{val}</span>
            ))}
          </div>

          <div class="bars">
            {this.data.map(d => (
              <div class="bar-wrapper">
                <div
                  class="bar"
                  style={{
                    height: `${(d.value / maxValue) * chartHeight}px`,
                    background: d.color,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
