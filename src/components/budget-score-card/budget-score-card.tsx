import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'budget-score-card',
  styleUrl: 'budget-score-card.css',
  shadow: false,
})
export class BudgetScoreCard {
  @Prop() score: number = 0;
  @Prop() peerScore: number = 0;
  @Prop() grade: string = 'A+';

  render() {
    return (
      <div class="budget-health-score-card">
        {/* <div class="title-row">
          <span class="title">Your Budget Health Score</span>
        </div> */}

        <div class="content-row">
          <div class="left">
            <speedometer-gauge value={this.score}></speedometer-gauge>
            <div class="big-score">{this.score}</div>
          </div>

          <div class="right">
            <div class="grade-circle">{this.grade}</div>
            <div class="peer">Peer's Score = {this.peerScore}</div>
          </div>
        </div>
      </div>
    );
  }
}
