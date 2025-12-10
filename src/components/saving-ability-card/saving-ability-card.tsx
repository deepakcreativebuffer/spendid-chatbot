import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'saving-ability-card',
  styleUrl: 'saving-ability-card.css',
  shadow: false,
})
export class SavingAbilityCard {
  @Prop() label: string = 'Monthly Predicted Saving Ability';
  @Prop() amount: string = '$0';
  @Prop() tag: string = '';

  render() {
    const numericAmount = parseFloat(this.amount.replace(/[^0-9.-]/g, ''));

    let scorecardClass = 'scorecard';

    if (numericAmount < 0) {
      scorecardClass += ' neg-scorecard';
    } else if (numericAmount < 80) {
      scorecardClass += ' orange-scorecard';
    }
    return (
      <div class={scorecardClass}>
        <div class="title">{this.label}</div>

        <div class="row">
          <div class="amount">{this.amount}</div>
          <div class="tag">{this.tag}</div>
        </div>
      </div>
    );
  }
}
