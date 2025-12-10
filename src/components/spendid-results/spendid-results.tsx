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
  grade: any;

  handleBack() {
    this.closeResult.emit(false);
  }

  // Helper dummy data
  getResultsByZip(zip: string) {
    const dataMap: Record<string, any> = {
      // Good Score
      '35210': {
        score: 125.7,
        peerScore: 106.6,
        youSaving: 6537,
        peerSaving: 3724,
        grade: 'A+',
        youDonut: [
          { category: 'Needs', monthly: 3430, percentage: 24.5 },
          { category: 'Wants', monthly: 3920, percentage: 28 },
          { category: 'Finacial Goals', monthly: 6636, percentage: 47.4 },
        ],
        peerDonut: [
          { category: 'Needs', monthly: 5460, percentage: 39 },
          { category: 'Wants', monthly: 4004, percentage: 28.6 },
          { category: 'Finacial Goals', monthly: 4521, percentage: 32.3 },
        ],
        breakdown: { score: 90, needs: 57.1, wants: 28.6, savings: 14.3 },
      },
      // Bad Score
      '14001': {
        score: 27.8,
        peerScore: 16.7,
        youSaving: -1208,
        peerSaving: -1951,
        grade: '',
        youDonut: [
          { category: 'Needs', monthly: 1995, percentage: 64.8 },
          { category: 'Wants', monthly: 785, percentage: 25.5 },
          { category: 'Finacial Goals', monthly: 298, percentage: 9.7 },
        ],
        peerDonut: [
          { category: 'Needs', monthly: 3363, percentage: 109.2 },
          { category: 'Wants', monthly: 1493, percentage: 48.5 },
          { category: 'Finacial Goals', monthly: 1, percentage: 1 },
        ],
        breakdown: { score: 50, needs: 55, wants: 30, savings: 15 },
      },
      // Average
      '13045': {
        score: 68.8,
        peerScore: 81.5,
        youSaving: -574,
        peerSaving: 76,
        grade: '',
        youDonut: [
          { category: 'Needs', monthly: 3750, percentage: 73.4 },
          { category: 'Food', monthly: 1359, percentage: 26.6 },
          { category: 'Finacial Goals', monthly: 1, percentage: 1 },
        ],
        peerDonut: [
          { category: 'Needs', monthly: 3219, percentage: 63 },
          { category: 'Wants', monthly: 1522, percentage: 29.8 },
          { category: 'Finacial Goals', monthly: 367, percentage: 7.2 },
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
          { category: 'Needs', monthly: 1200, percentage: 50 },
          { category: 'Wants', monthly: 600, percentage: 30 },
          { category: 'Finacial Goals', monthly: 300, percentage: 20 },
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
    this.grade = results.grade;
  }
  render() {
    console.log('thred', this.thread);
    return (
      <div class="spendid-container">
        <div class="header-row">
          <div class="header-box">✨ Your SPENDiD Results ✨</div>
          <button class="back-btn" onClick={() => this.handleBack()}>
            Close
          </button>
        </div>

        <section class="card score-card">
          <div class="card-left">
            <div class="card-title">Budget Health Score</div>
            <budget-score-card score={this.score} peerScore={this.peerScore} grade={this.grade}></budget-score-card>
          </div>
        </section>

        <section class="card savings-card">
          <div class="card-title">Monthly Savings Ability</div>
          <div class="card-mthly-saving">
            <saving-ability-card amount={`$${this.youSaving}`} tag="You"></saving-ability-card>
            <saving-ability-card amount={`$${this.peerSaving}`} tag="Peers"></saving-ability-card>
          </div>
        </section>

        <section class="card breakdown-card">
          <div class="card-title">Spending Breakdown (50–30–20)</div>
          <div class="breakdown-pie">
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
                <span class="dot green"></span>Needs
                {/* <strong>{this.breakdown.needs}%</strong> */}
              </div>
              <div class="legend-row">
                <span class="dot blue"></span>Wants
                {/* <strong>{this.breakdown.wants}%</strong> */}
              </div>
              <div class="legend-row">
                <span class="dot gold"></span>Finacial Goals
                {/* <strong>{this.breakdown.savings}%</strong> */}
              </div>
            </div>
          </div>
        </section>

        <section class="card insights-card">
          <div class="insights-title">💡 Key Insights</div>
          <ul>
            <li>Your housing cost looks comfortable for your area.</li>
            <li>Your predicted savings ability is strong.</li>
            <li>You may be able to increase savings further by adjusting discretionary spending.</li>
          </ul>
        </section>
      </div>
    );
  }
}
