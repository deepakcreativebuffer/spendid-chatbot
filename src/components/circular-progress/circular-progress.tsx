import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'circular-progress',
  styleUrl: 'circular-progress.css',
  shadow: true,
})
export class CircularProgress {
  @Prop() value: number = 99.6;
  @Prop() size: number = 150;
  @Prop() strokeWidth: number = 15;

  render() {
    const radius = (this.size - this.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const segments = [
      { color: '#4caf50', value: 62 }, // Green
      { color: '#f4c43f', value: 10 }, // Yellow
      { color: '#4a7afc', value: 28 }, // Blue
    ];

    let offset = 0;

    return (
      <svg width={this.size} height={this.size}>
        <g transform={`rotate(-90 ${this.size / 2} ${this.size / 2})`}>
          {segments.map(seg => {
            const dashArray = (seg.value / 100) * circumference;
            const circle = (
              <circle
                r={radius}
                cx={this.size / 2}
                cy={this.size / 2}
                fill="transparent"
                stroke={seg.color}
                stroke-width={this.strokeWidth}
                stroke-dasharray={`${dashArray} ${circumference - dashArray}`}
                stroke-dashoffset={-offset}
                stroke-linecap="round"
              />
            );
            offset += dashArray;
            return circle;
          })}
        </g>

        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-weight="bold" fill="#333">
          {this.value}
        </text>

        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#999">
          /100
        </text>
      </svg>
    );
  }
}
