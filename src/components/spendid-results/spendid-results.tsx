import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'spendid-results',
  styleUrl: 'spendid-results.css',
  shadow: false,
})
export class SpendidResults {
  @Prop() thread: any;
  @Event() closeResult: EventEmitter<boolean>;
  score: number;
  peerScore: number;
  savingsData: any;
  breakdown: any;

  handleBack() {
    this.closeResult.emit(false);
  }

  // Helper to map zip code to dummy data
  getResultsByZip(zip: string) {
    const dataMap: Record<string, any> = {
      '35210': {
        score: 90,
        peerScore: 75,
        savingsData: [
          { label: 'Savings 1', value: 12000, color: '#4B8E7D' },
          { label: 'Savings 2', value: 8000, color: '#88E6F9' },
        ],
        breakdown: { score: 85, needs: 45, wants: 35, savings: 20 },
      },
      '26313': {
        score: 55,
        peerScore: 60,
        savingsData: [
          { label: 'Savings 1', value: 6000, color: '#4B8E7D' },
          { label: 'Savings 2', value: 4000, color: '#88E6F9' },
        ],
        breakdown: { score: 50, needs: 55, wants: 30, savings: 15 },
      },
      '15502': {
        score: 70,
        peerScore: 68,
        savingsData: [
          { label: 'Savings 1', value: 10000, color: '#4B8E7D' },
          { label: 'Savings 2', value: 8000, color: '#88E6F9' },
        ],
        breakdown: { score: 65, needs: 50, wants: 30, savings: 20 },
      },
    };

    // Default if zip code is not found
    return (
      dataMap[zip] || {
        score: 65,
        peerScore: 65,
        savingsData: [
          { label: 'Savings 1', value: 9000, color: '#4B8E7D' },
          { label: 'Savings 2', value: 7000, color: '#88E6F9' },
        ],
        breakdown: { score: 60, needs: 50, wants: 30, savings: 20 },
      }
    );
  }

  componentWillLoad() {
    const zip = this.thread?.messages?.find(msg => msg.type === 'user' && msg.replyType === 'zip');
    console.log('zip', zip);
    const results = this.getResultsByZip(zip?.message);
    console.log('results123', results);
    this.score = results.score;
    this.peerScore = results.peerScore;
    this.savingsData = results.savingsData;
    this.breakdown = results.breakdown;
  }
  render() {
    console.log('thred', this.thread);
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

            <spendid-gauge value={this.score} max={100}></spendid-gauge>
            {/* <budget-score-card></budget-score-card> */}
          </div>

          <div class="card-right">
            <div class="score-number">You Score</div>
            <div class="big">{this.score}</div>
            <div class="peer">Peer Average</div>
            <div class="peer-num">{this.peerScore}</div>
          </div>
        </section>

        <section class="card savings-card">
          <div class="card-title">Monthly Savings Ability</div>

          <monthly-savings data={this.savingsData}></monthly-savings>

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
            <circular-progress value={this.breakdown.score} size={150} strokeWidth={12}></circular-progress>
            <div class="legend">
              <div class="legend-row">
                <span class="dot gold"></span>Needs <strong>{this.breakdown.needs}%</strong>
              </div>
              <div class="legend-row">
                <span class="dot blue"></span>Wants <strong>{this.breakdown.wants}%</strong>
              </div>
              <div class="legend-row">
                <span class="dot green"></span>Savings <strong>{this.breakdown.savings}%%</strong>
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
