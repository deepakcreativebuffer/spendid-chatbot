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
  youSaving: any;
  peerSaving: any;
  youDonut: any;
  peerDonut: any;
  breakdown: any;

  handleBack() {
    this.closeResult.emit(false);
  }

  // Helper to map zip code to dummy data
  getResultsByZip(zip: string) {
    const dataMap: Record<string, any> = {
      //Good Score
      '35210': {
        score: 125.7,
        peerScore: 106.6,
        youSaving: 6537,
        peerSaving: 3724,
        youDonut: [
          { category: 'Needs', monthly: 1200 },
          { category: 'Wants', monthly: 600 },
          { category: 'Finacial Goals', monthly: 300 },
        ],
        peerDonut: [
          { category: 'Needs', monthly: 1200 },
          { category: 'Wants', monthly: 600 },
          { category: 'Finacial Goals', monthly: 300 },
        ],
        breakdown: { score: 90, needs: 45, wants: 35, savings: 20 },
      },
      // Bad Score
      '14001': {
        score: 109.5,
        peerScore: 75.2,
        youSaving: 1200,
        peerSaving: 1000,
        youDonut: [
          { category: 'Needs', monthly: 1200 },
          { category: 'Wants', monthly: 600 },
          { category: 'Finacial Goals', monthly: 300 },
        ],
        peerDonut: [
          { category: 'Needs', monthly: 1200 },
          { category: 'Wants', monthly: 600 },
          { category: 'Finacial Goals', monthly: 300 },
        ],
        breakdown: { score: 50, needs: 55, wants: 30, savings: 15 },
      },
      // Average
      '15502': {
        score: 70,
        peerScore: 68,
        youSaving: 1200,
        peerSaving: 1000,
        youDonut: [
          { category: 'Needs', monthly: 1200 },
          { category: 'Wants', monthly: 600 },
          { category: 'Finacial Goals', monthly: 300 },
        ],
        peerDonut: [
          { category: 'Needs', monthly: 1200 },
          { category: 'Food', monthly: 600 },
          { category: 'Finacial Goals', monthly: 300 },
        ],
        breakdown: { score: 65, needs: 50, wants: 30, savings: 20 },
      },
    };

    // Default if zip code is not found
    return (
      dataMap[zip] || {
        score: 65,
        peerScore: 65,
        youSaving: 1200,
        peerSaving: 1000,
        youDonut: [
          { category: 'Needs', monthly: 1200 },
          { category: 'Wants', monthly: 600 },
          { category: 'Finacial Goals', monthly: 300 },
        ],
        peerDonut: [
          { category: 'Needs', monthly: 1200 },
          { category: 'Wants', monthly: 600 },
          { category: 'Finacial Goals', monthly: 300 },
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
    this.youSaving = results.youSaving;
    this.peerSaving = results.peerSaving;
    this.youDonut = results.youDonut;
    this.peerDonut = results.peerDonut;
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
            <budget-score-card score={this.score} peerScore={this.peerScore} grade="A+"></budget-score-card>
          </div>
        </section>

        <section class="card savings-card">
          <div class="card-title">Monthly Savings Ability</div>

          <saving-ability-card amount={`$${this.youSaving}`} tag="You"></saving-ability-card>

          <br />

          <saving-ability-card amount={`$${this.peerSaving}`} tag="Peers"></saving-ability-card>
        </section>

        <section class="card breakdown-card">
          <div class="card-title">Spending Breakdown (50–30–20)</div>
          <div>
            <div class="pie-chart-you">
              <pie-chart data={this.youDonut} type="$" dark={false}></pie-chart>
              <div class="card-title">You</div>
            </div>
            <div class="pie-chart-you">
              <pie-chart data={this.peerDonut} type="$" dark={false}></pie-chart>
              <div class="card-title">Yours Peer</div>
            </div>
          </div>
          <div class="breakdown-content">
            <div class="legend">
              <div class="legend-row">
                <span class="dot gold"></span>Needs <strong>{this.breakdown.needs}%</strong>
              </div>
              <div class="legend-row">
                <span class="dot blue"></span>Wants <strong>{this.breakdown.wants}%</strong>
              </div>
              <div class="legend-row">
                <span class="dot green"></span>Savings <strong>{this.breakdown.savings}%</strong>
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
