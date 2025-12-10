import { Component, h, Prop, Event, EventEmitter, State, Fragment, Watch } from '@stencil/core';
interface ChatMessage {
  type: string;
  message: string;
  replyType?: string;
  [key: string]: any;
}
@Component({
  tag: 'chat-screen',
  styleUrl: 'chat-screen.css',
  shadow: false,
})
export class ChatScreen {
  @Prop() thread: any;
  @Prop() isBlankChat: boolean = false;
  @Prop() activeThread: string = '';
  @Event() sendMessage: EventEmitter<{ text: string; ts: number; messages: ChatMessage[] }>;
  @State() input = '';
  @State() bubbleInput = '';
  @State() inputType: string = 'number';
  @State() chatMessages: ChatMessage[] = [];
  @State() incomeOccupation = '';
  @State() incomeFrequency = '';
  @State() incomeAmount = '';
  @State() incomeType = '';
  @State() currentBotKey = 'welcome';
  @State() dynamicInputCount: number = 0;
  @State() dynamicValues: string[] = [];
  @Event() showResult: EventEmitter<boolean>;
  @State() incomeSources: any[] = [];
  @State() studentDebt: string = '';
  @State() creditDebt: string = '';
  @State() otherDebt: string = '';
  @State() dynamicPlaceholder: string = 'Type Here';
  botMessages: any = {};
  private messagesWrap!: HTMLElement;
  @Watch('isBlankChat')
  handleBlankChatChange() {
    if (this.isBlankChat) {
      this.chatMessages = [this.botMessages.welcome];
    }
  }
  @Watch('thread')
  handleThreadChange() {
    if (this.thread) {
      this.chatMessages = this.thread.messages?.length ? [...this.thread.messages] : [this.botMessages.welcome];
    } else if (this.isBlankChat) {
      this.chatMessages = [this.botMessages.welcome];
    }
  }

  async componentWillLoad() {
    const res = await fetch('/assets/data.json');
    this.botMessages = await res.json();
    this.chatMessages = [this.botMessages.welcome];
  }

  handleOption(id: string, label: string) {
    const userMsg = { type: 'user', message: label };
    this.chatMessages = [...this.chatMessages, userMsg];
    // this.sendMessage.emit(label);

    if (id === 'begin') {
      this.chatMessages = [...this.chatMessages, this.botMessages.ask_location, this.botMessages.zip_input];
    }

    if (id === 'not_now') {
      this.chatMessages = [...this.chatMessages, this.botMessages.maybelater];
    }

    if (id === 'nodebt') {
      this.chatMessages = [...this.chatMessages, this.botMessages.result];
    }
    if (id === 'own') {
      this.chatMessages = [...this.chatMessages, this.botMessages.own, this.botMessages.monthlyRentInput];
    }
    if (id === 'rent' || id === 'yes' || id === 'no') {
      const lastBot = [...this.chatMessages].reverse().find(m => m.type === 'bot');
      if (lastBot?.next) {
        this.showMessageAndNext(lastBot.next);
      }
    }
  }

  handleOptionType(type: string) {
    this.inputType = type;
  }

  handleIncomeSourceCount(count: number) {
    const num = Number(count);

    this.incomeSources = Array(num)
      .fill(0)
      .map(() => ({
        frequency: '',
        amount: '',
        type: '',
      }));
  }

  onSend() {
    if (!this.input.trim()) return;
    const lastBot = [...this.chatMessages].reverse().find(m => m.type === 'bot');

    let userMsg: ChatMessage = { type: 'user', message: this.input };

    if (lastBot.quesType === 'household') {
      userMsg = { ...userMsg, replyType: 'household' };
    }
    if (lastBot.quesType === 'income') {
      userMsg = { ...userMsg, replyType: 'income' };
    }
    this.chatMessages = [...this.chatMessages, userMsg];

    if (this.input.toLowerCase().includes('dont know') || this.input.toLowerCase().includes("don't know")) {
      this.chatMessages = [...this.chatMessages, this.botMessages.zip_not_known];
    }

    if (lastBot?.quesType === 'household' && isNaN(Number(this.input.trim()))) {
      const validationMsg = { type: 'bot', message: 'Enter valid household Number', next: lastBot?.next };
      this.chatMessages = [...this.chatMessages, validationMsg];
      this.sendMessage.emit({
        text: this.input,
        ts: Date.now(),
        messages: this.chatMessages,
      });
      this.input = '';
      this.studentDebt = '';
      this.creditDebt = '';
      this.otherDebt = '';
      return;
    }

    if (lastBot?.quesType === 'income') {
      const raw = this.input.trim();
      const num = Number(raw);

      const isValid = [1, 2, 3, 4].includes(num);

      if (!isValid) {
        const validationMsg = {
          type: 'bot',
          message: 'Enter valid Income (only 1, 2, 3, or 4 allowed)',
          next: lastBot?.next,
          quesType: lastBot?.quesType,
        };

        this.chatMessages = [...this.chatMessages, validationMsg];

        this.sendMessage.emit({
          text: this.input,
          ts: Date.now(),
          messages: this.chatMessages,
        });

        this.input = '';
        this.studentDebt = '';
        this.creditDebt = '';
        this.otherDebt = '';
        return;
      }
    }

    if (lastBot?.next) {
      this.showMessageAndNext(lastBot.next);
    }
    if (lastBot?.quesType === 'household') {
      const count = Number(this.input.trim());
      this.dynamicInputCount = count;
      this.dynamicValues = Array(count).fill('');
    }
    console.log('last', lastBot);
    if (lastBot?.quesType === 'income') {
      this.handleIncomeSourceCount(Number(this.input.trim()));
    }

    this.sendMessage.emit({
      text: this.input,
      ts: Date.now(),
      messages: this.chatMessages,
    });
    this.input = '';
    this.studentDebt = '';
    this.creditDebt = '';
    this.otherDebt = '';
    this.dynamicPlaceholder = 'Type Here';
  }

  showMessageAndNext(id: string) {
    const msg = this.botMessages[id];
    if (!msg) return;

    this.chatMessages = [...this.chatMessages, msg];
    this.currentBotKey = id;

    if (msg.input === true) return;
    if (msg.options && msg.options.length > 0) {
      return;
    }
    if (msg.show_with_next && msg.next) {
      this.showMessageAndNext(msg.next);
      return;
    }
    if (msg.placeholderDynamic) {
      this.dynamicPlaceholder = msg.placeholderDynamic;
    } else {
      this.dynamicPlaceholder = 'Type Here';
    }

    if (!msg.input && !msg.options && !msg.show_with_next) return;

    if (msg.next) {
      this.showMessageAndNext(msg.next);
    }
  }

  get disableMainSend() {
    const last = this.chatMessages[this.chatMessages.length - 1];

    if (last?.type === 'bot' && (last?.input || last?.options?.length > 0)) {
      return true;
    }

    return false;
  }

  handleInputSubmit(msg: string, reply: string) {
    console.log('mesg123', msg);
    if (!msg.trim()) return;

    const userMsg = { type: 'user', message: msg, replyType: reply };
    this.chatMessages = [...this.chatMessages, userMsg];

    if (msg.toLowerCase().includes('dont know') || msg.toLowerCase().includes("don't know")) {
      this.chatMessages = [...this.chatMessages, this.botMessages.zip_not_known];
    }

    const lastBot = [...this.chatMessages].reverse().find(m => m.type === 'bot');
    console.log('lastBotmessage>>>', lastBot);
    if (lastBot?.next) {
      this.showMessageAndNext(lastBot.next);
    }
    console.log('mes>>>>>>>>>>.', msg);
    // this.sendMessage.emit(msg);
    this.sendMessage.emit({
      text: msg,
      ts: Date.now(),
      messages: this.chatMessages,
    });
  }
  handleResult = (msg: string) => {
    if (!msg.trim()) return;

    const userMsg = { type: 'user', message: msg };
    this.chatMessages = [...this.chatMessages, userMsg];
    // this.sendMessage.emit(msg);
    this.showResult.emit(true);
  };

  @Watch('chatMessages')
  messagesChanged() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (!this.messagesWrap) return;

    requestAnimationFrame(() => {
      this.messagesWrap.scrollTo({
        top: this.messagesWrap.scrollHeight,
        behavior: 'smooth',
      });
    });
  }

  validateZip(e: any) {
    let value = e.target.value;

    if (this.inputType !== 'text') {
      value = value.replace(/\D/g, '');

      if (value.length > 5) {
        value = value.slice(0, 5);
      }
    } else {
      value = value.replace(/[^A-Za-z\s]/g, '');
    }

    this.bubbleInput = value;

    e.target.value = value;
  }

  validateAge(e: any) {
    let value = e.target.value;

    if (this.inputType !== 'text') {
      value = value.replace(/\D/g, '');

      if (value.length > 3) {
        value = value.slice(0, 3);
      }
    } else {
      value = value.replace(/[^A-Za-z\s]/g, '');
    }

    this.bubbleInput = value;

    e.target.value = value;
  }

  render() {
    console.log('activeThread', this.activeThread);
    console.log('this.thread?.messages', this.thread?.messages);
    return (
      <main class="chat-area">
        <div class="canvas">
          <div class="messages-wrap" ref={el => (this.messagesWrap = el)}>
            {this.chatMessages.map((m: any) => {
              const isAgeMessage = m.replyType === 'age' && typeof m.message === 'string' && m.message.includes('Person');
              const isIncomeMessage = m.replyType === 'income' && typeof m.message === 'string' && m.message.includes('Income Source');
              const isDebt = m.replyType === 'payment' && typeof m.message === 'string';
              let incomeItems = [];
              if (isIncomeMessage) {
                incomeItems = m.message.split('\n').map(line => {
                  const [label, value] = line.split(':');
                  return { label: label.trim(), value: value.trim() };
                });
              }
              let ageItems = [];
              if (isAgeMessage) {
                ageItems = m.message.split('\n').map(line => {
                  const [label, value] = line.split(':');
                  return {
                    label: label.trim(),
                    value: value.trim(),
                  };
                });
              }
              let debtItem = [];
              if (isDebt) {
                debtItem = m.message.split('\n').map(line => {
                  const [label, value] = line.split(':');
                  return {
                    label: label.trim(),
                    value: value.trim(),
                  };
                });
              }
              return (
                <Fragment>
                  <div class={m.type === 'bot' ? 'msg-bot' : 'msg-user'}>
                    {m.type === 'bot' && <img class="avatar-bot" src="/assets/icon/avatar.svg" alt="bot" />}
                    <div class="bubble">
                      {isAgeMessage ? (
                        <div class="age-container">
                          {ageItems.map(item => (
                            <div class="age-pill">
                              <span class="label">{item.label} :</span>
                              <span class="value">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {isIncomeMessage ? (
                        <div class="age-container">
                          {incomeItems.map(item => (
                            <div class="age-pill">
                              <span class="label">{item.label} :</span>
                              <span class="value">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {isDebt ? (
                        <div class="age-container">
                          {debtItem.map(item => (
                            <div class="age-pill">
                              <span class="label">{item.label} :</span>
                              <span class="value">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {((m.replyType === 'insurance' && m.type === 'user') || (m.replyType === 'vehicle' && m.type === 'user') || (m.replyType === 'rent' && m.type === 'user')) &&
                        !isAgeMessage &&
                        !isIncomeMessage &&
                        !isDebt && <p>$ {m.message}</p>}

                      {/* NORMAL MESSAGE */}
                      {!isAgeMessage &&
                        !isIncomeMessage &&
                        !isDebt &&
                        !(
                          (m.replyType === 'insurance' && m.type === 'user') ||
                          (m.replyType === 'vehicle' && m.type === 'user') ||
                          (m.replyType === 'rent' && m.type === 'user')
                        ) && <p>{m.message}</p>}
                      {m.options && (
                        <div class="options-row">
                          {m.options.map((opt: any) => (
                            <button class="option-btn" onClick={() => this.handleOption(opt.id, opt.label)}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {m.input && m.inputType === 'zip_input' && (
                        <div class="input-bubble">
                          <input
                            type={this.inputType === 'text' ? 'text' : 'number'}
                            placeholder={this.inputType === 'text' ? 'Enter Area' : 'Enter Zip'}
                            onInput={(e: any) => this.validateZip(e)}
                            onKeyDown={(e: any) => e.key === 'Enter' && this.handleInputSubmit(e.target.value, 'zip')}
                          />
                          <button class="option" onClick={() => this.handleOptionType(this.inputType === 'text' ? 'number' : 'text')}>{`Type ${
                            this.inputType === 'text' ? 'Zip' : 'Area'
                          } Instant`}</button>
                          <button
                            disabled={
                              !this.bubbleInput ||
                              (this.inputType === 'number' && this.bubbleInput.length !== 5) ||
                              (this.inputType === 'text' && this.bubbleInput.trim().length < 2)
                            }
                            class={
                              !this.bubbleInput ||
                              (this.inputType === 'number' && this.bubbleInput.length !== 5) ||
                              (this.inputType === 'text' && this.bubbleInput.trim().length < 2)
                                ? 'disabled-btn'
                                : ''
                            }
                            onClick={(e: any) => {
                              const wrapper = (e.target as HTMLElement).closest('.input-bubble');
                              const inputEl = wrapper.querySelector('input') as HTMLInputElement;
                              this.handleInputSubmit(inputEl.value, m.replyType);
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {m.input && m.inputType === 'house_hold' && (
                        <div class="input-bubble">
                          {this.dynamicValues.map((val, index) => (
                            <div class="age-row">
                              <p class="input-label">Person {index + 1}</p>

                              <input
                                type="number"
                                placeholder="Enter Age"
                                value={val}
                                onInput={(e: any) => {
                                  const newArr = [...this.dynamicValues];
                                  newArr[index] = e.target.value;
                                  this.dynamicValues = newArr;
                                }}
                              />
                            </div>
                          ))}

                          <button
                            disabled={this.dynamicValues.some(v => !v || v.trim() === '')}
                            class={this.dynamicValues.some(v => !v || v.trim() === '') ? 'disabled-btn' : ''}
                            onClick={() => {
                              const allAges = this.dynamicValues.map((age, index) => `Person ${index + 1}: ${age}`).join('\n');
                              this.handleInputSubmit(allAges, m.replyType);
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {m.resultButton && (
                        <div class="input-bubble">
                          <button
                            class="result-btn"
                            onClick={() => {
                              this.handleResult('Show Result');
                            }}
                          >
                            Show Result
                          </button>
                        </div>
                      )}

                      {m.input && m.inputType === 'debt' && (
                        <div class="input-bubble debt-bubble">
                          <p class="input-label">Student Debt</p>
                          <input
                            type="number"
                            placeholder="Enter Student Debt"
                            value={this.studentDebt}
                            onInput={(e: any) => (this.studentDebt = e.target.value)}
                            // onKeyDown={(e: any) => e.key === 'Enter' && this.submitDebtInputs()}
                          />

                          <p class="input-label">Credit Card Debt</p>

                          <input
                            type="number"
                            placeholder="Enter Credit Card Debt"
                            value={this.creditDebt}
                            onInput={(e: any) => (this.creditDebt = e.target.value)}
                            // onKeyDown={(e: any) => e.key === 'Enter' && this.submitDebtInputs()}
                          />

                          <p class="input-label">Other Debt</p>
                          <input
                            type="number"
                            placeholder="Enter Other Debt"
                            value={this.otherDebt}
                            onInput={(e: any) => (this.otherDebt = e.target.value)}
                            // onKeyDown={(e: any) => e.key === 'Enter' && this.submitDebtInputs()}
                          />

                          <button
                            disabled={!this.studentDebt || !this.creditDebt || !this.otherDebt}
                            class={!this.studentDebt || !this.creditDebt || !this.otherDebt ? 'disabled-btn' : ''}
                            onClick={() => {
                              const value = `Student Debt: $ ${this.studentDebt} \n Credit Debt: $ ${this.creditDebt} \n Other Debt: $ ${this.otherDebt}`;
                              this.handleInputSubmit(value, m.replyType);
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {m.input && m.inputType === 'rent' && (
                        <div class="input-bubble">
                          <input type="number" placeholder={m.placeholder} onKeyDown={(e: any) => e.key === 'Enter' && this.handleInputSubmit(e.target.value, m.replyType)} />
                          <button
                            onClick={(e: any) => {
                              const wrapper = (e.target as HTMLElement).closest('.input-bubble');
                              const inputEl = wrapper.querySelector('input') as HTMLInputElement;
                              this.handleInputSubmit(inputEl.value, m.replyType);
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {m.input && m.inputType === 'income' && (
                        <div class="panel-box">
                          <p class="panel-title">Income Sources</p>

                          {this.incomeSources.map((src, index) => (
                            <div class="income-panel">
                              <p class="panel-subtitle">Source {index + 1}</p>

                              {/* <div class="panel-field">
                                <input
                                  type="text"
                                  placeholder="Occupation"
                                  value={src.occupation}
                                  onInput={(e: any) => {
                                    this.incomeSources[index].occupation = e.target.value;
                                    this.incomeSources = [...this.incomeSources];
                                  }}
                                />
                              </div> */}

                              <div class="panel-field dropdown">
                                <select
                                  onInput={(e: any) => {
                                    this.incomeSources[index].frequency = e.target.value;
                                    this.incomeSources = [...this.incomeSources];
                                  }}
                                >
                                  <option value="">Select Frequency</option>
                                  <option value="Weekly">Weekly</option>
                                  <option value="Every 2 Weeks">Every 2 Weeks</option>
                                  <option value="Twice per Month">Twice per Month</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Semi-Anually">Semi-Anually</option>
                                  <option value="Anually">Anually</option>
                                </select>
                                <span class="caret"></span>
                              </div>

                              <div class="panel-field">
                                <input
                                  type="number"
                                  placeholder="Amount"
                                  value={src.amount}
                                  onInput={(e: any) => {
                                    this.incomeSources[index].amount = e.target.value;
                                    this.incomeSources = [...this.incomeSources];
                                  }}
                                />
                              </div>

                              <div class="panel-field dropdown">
                                <select
                                  onInput={(e: any) => {
                                    this.incomeSources[index].type = e.target.value;
                                    this.incomeSources = [...this.incomeSources];
                                  }}
                                >
                                  <option value="">Select Type</option>
                                  <option value="Gross">Gross</option>
                                  <option value="Net">Net "Take Home"</option>
                                </select>
                                <span class="caret"></span>
                              </div>
                            </div>
                          ))}

                          <button
                            class={`panel-button ${this.incomeSources.some(s => !s.frequency?.trim() || !s.amount?.toString().trim() || !s.type?.trim()) ? 'disabled-btn' : ''}`}
                            disabled={this.incomeSources.some(s => !s.frequency?.trim() || !s.amount?.toString().trim() || !s.type?.trim())}
                            onClick={() => {
                              //   const output = this.incomeSources
                              //     .map((src, i) => `Income Source ${i + 1}: ${src.occupation} | ${src.frequency} | ${src.amount} | ${src.type}`)
                              //     .join('\n');
                              const output = this.incomeSources.map((src, i) => `Income Source ${i + 1}: $ ${src.amount}`).join('\n');

                              this.handleInputSubmit(output, m.replyType);
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {/* {m.result === true && <spendid-results></spendid-results>} */}
                    </div>
                    {m.type !== 'bot' && <img class="avatar-user" src="/assets/icon/user-avatar.svg" alt="user" />}
                  </div>
                </Fragment>
              );
            })}
            {/* <div style={{ height: '120px' }}></div> */}
          </div>

          <div class="composer-wrap">
            <div class="composer-box">
              <input value={this.input} onInput={(e: any) => (this.input = e.target.value)} placeholder={this.dynamicPlaceholder} />

              <button
                class={`send ${this.disableMainSend ? 'disabled-btn' : ''}`}
                disabled={this.disableMainSend}
                onClick={() => !this.disableMainSend && this.onSend()}
                aria-label="Send"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
