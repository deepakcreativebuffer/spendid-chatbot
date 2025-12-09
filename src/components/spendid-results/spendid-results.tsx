import { Component, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'spendid-results',
  styleUrl: 'spendid-results.css',
  shadow: false,
})
export class SpendidResults {
  @Event() closeResult: EventEmitter<boolean>;
  handleBack() {
    this.closeResult.emit(false);
  }
  render() {
    return (
      <div class="spendid-container">
        <div class="header-row">
          <button class="back-btn" onClick={() => this.handleBack()}>
            Close
          </button>

          <div class="header-box">✨ Your SPENDiD Results ✨</div>
        </div>

        <section class="card score-card">
          <div class="card-left">
            <div class="card-title">Budget Health Score</div>

            <spendid-gauge value={79.6} max={100}></spendid-gauge>
          </div>

          <div class="card-right">
            <div class="score-number">You Score</div>
            <div class="big">99.6</div>
            <div class="peer">Peer Average</div>
            <div class="peer-num">72.0</div>
          </div>
        </section>

        <section class="card savings-card">
          <div class="card-title">Monthly Savings Ability</div>

          <monthly-savings
            data={[
              { label: 'Savings 1', value: 13000, color: '#4B8E7D' },
              { label: 'Savings 2', value: 8000, color: '#88E6F9' },
            ]}
          ></monthly-savings>

          <div class="score-row">
            <div class="score-pill">
              <div class="pill-title">You Score</div>
              <div class="pill-value">99.6</div>
            </div>
            <div class="score-pill peer-pill">
              <div class="pill-title">Peer Average</div>
              <div class="pill-value">72.0</div>
            </div>
          </div>
        </section>

        <section class="card breakdown-card">
          <div class="card-title">Spending Breakdown (50–30–20)</div>

          <div class="breakdown-content">
            {/* <div class="donut">
              <div class="donut-ring">
                <div class="donut-text">
                  99.6
                  <div class="sub">/100</div>
                </div>
              </div>
            </div> */}

            <circular-progress value={79.6} size={150} strokeWidth={12}></circular-progress>
            <div class="legend">
              <div class="legend-row">
                <span class="dot gold"></span>Needs <strong>10%</strong>
              </div>
              <div class="legend-row">
                <span class="dot blue"></span>Wants <strong>28%</strong>
              </div>
              <div class="legend-row">
                <span class="dot green"></span>Savings <strong>72%</strong>
              </div>
            </div>
          </div>
        </section>

        <section class="card insights-card">
          <div class="insights-title">💡 Key Insights</div>
          <ul>
            <li>Your housing cost is within peer average</li>
            <li>Your savings rate is excellent</li>
            <li>Consider optimizing your discretionary spending to increase savings</li>
          </ul>
        </section>
      </div>
    );
  }
}
