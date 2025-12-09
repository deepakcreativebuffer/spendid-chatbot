import { Component, h, Prop, Event, EventEmitter, State, Fragment, Watch } from '@stencil/core';

@Component({
  tag: 'chat-screen',
  styleUrl: 'chat-screen.css',
  shadow: false,
})
export class ChatScreen {
  @Prop() thread: any;
  @Prop() isBlankChat: boolean = false;
  @Prop() activeThread: string = '';
  @Event() sendMessage: EventEmitter<{ text: string; ts: number; messages: any }>;
  @State() input = '';
  @State() bubbleInput = '';
  @State() inputType: string = 'number';
  @State() chatMessages: any[] = [];
  @State() incomeOccupation = '';
  @State() incomeFrequency = '';
  @State() incomeAmount = '';
  @State() incomeType = '';
  @State() currentBotKey = 'welcome';
  @Event() showResult: EventEmitter<boolean>;
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
  //   @Watch('activeThread')
  //   handleThread() {
  //     if (this.activeThread) {
  //       this.chatMessages = this.thread?.messages;
  //     }
  //   }

  //   @Watch('thread')
  //   handleThreadChange() {
  //     if (this.thread) {
  //       // Set messages from the selected thread
  //       this.chatMessages = this.thread.messages?.length ? [...this.thread.messages] : [this.botMessages.welcome];
  //     } else if (this.isBlankChat) {
  //       // If no thread selected, show blank chat
  //       this.chatMessages = [this.botMessages.welcome];
  //     }
  //   }

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

    if (id === 'enter_city') {
      // Add next step
    }

    if (id === 'rent' || id === 'own' || id === 'yes' || id === 'no') {
      const lastBot = [...this.chatMessages].reverse().find(m => m.type === 'bot');
      if (lastBot?.next) {
        this.showMessageAndNext(lastBot.next);
      }
    }
  }

  handleOptionType(type: string) {
    this.inputType = type;
  }

  onSend() {
    if (!this.input.trim()) return;
    const lastBot = [...this.chatMessages].reverse().find(m => m.type === 'bot');

    const userMsg = { type: 'user', message: this.input };
    this.chatMessages = [...this.chatMessages, userMsg];

    if (this.input.toLowerCase().includes('dont know') || this.input.toLowerCase().includes("don't know")) {
      this.chatMessages = [...this.chatMessages, this.botMessages.zip_not_known];
    }
    console.log('lastBotmessage>>>', lastBot);

    if (lastBot?.quesType === 'household' && isNaN(Number(this.input.trim()))) {
      const validationMsg = { type: 'bot', message: 'Enter valid household Number', next: lastBot?.next };
      this.chatMessages = [...this.chatMessages, validationMsg];
      this.sendMessage.emit({
        text: this.input,
        ts: Date.now(),
        messages: this.chatMessages,
      });
      this.input = '';
      return;
    }

    if (lastBot?.quesType === 'income' && isNaN(Number(this.input.trim()))) {
      const validationMsg = { type: 'bot', message: 'Enter valid Income', next: lastBot?.next };
      this.chatMessages = [...this.chatMessages, validationMsg];
      this.sendMessage.emit({
        text: this.input,
        ts: Date.now(),
        messages: this.chatMessages,
      });
      this.input = '';
      return;
    }

    if (lastBot?.next) {
      this.showMessageAndNext(lastBot.next);
    }

    this.sendMessage.emit({
      text: this.input,
      ts: Date.now(),
      messages: this.chatMessages,
    });
    this.input = '';
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

    if (!msg.input && !msg.options && !msg.show_with_next) return;

    // ✔ AUTO-CONTINUE only when no user response is required
    if (msg.next) {
      this.showMessageAndNext(msg.next);
    }
  }

  handleInputSubmit(msg: string) {
    console.log('mesg123', msg);
    if (!msg.trim()) return;

    const userMsg = { type: 'user', message: msg };
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

    // ZIP MODE (Number)
    if (this.inputType !== 'text') {
      // Allow ONLY digits
      value = value.replace(/\D/g, '');

      // Limit to 5 digits
      if (value.length > 5) {
        value = value.slice(0, 5);
      }
    }

    // AREA MODE (Text)
    else {
      // Allow only letters & spaces
      value = value.replace(/[^A-Za-z\s]/g, '');

      // Max length handled by maxLength attr already
    }

    // Update state
    this.bubbleInput = value;

    // Update input field value
    e.target.value = value;
  }

  validateAge(e: any) {
    let value = e.target.value;

    // ZIP MODE (Number)
    if (this.inputType !== 'text') {
      // Allow ONLY digits
      value = value.replace(/\D/g, '');

      // Limit to 5 digits
      if (value.length > 3) {
        value = value.slice(0, 3);
      }
    }

    // AREA MODE (Text)
    else {
      // Allow only letters & spaces
      value = value.replace(/[^A-Za-z\s]/g, '');

      // Max length handled by maxLength attr already
    }

    // Update state
    this.bubbleInput = value;

    // Update input field value
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
              return (
                <Fragment>
                  <div class={m.type === 'bot' ? 'msg-bot' : 'msg-user'}>
                    {m.type === 'bot' && <img class="avatar-bot" src="/assets/icon/avatar.svg" alt="bot" />}
                    <div class="bubble">
                      <p>{m.message}</p>
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
                            onKeyDown={(e: any) => e.key === 'Enter' && this.handleInputSubmit(e.target.value)}
                          />
                          <button class="option" onClick={() => this.handleOptionType(this.inputType === 'text' ? 'number' : 'text')}>{`Type ${
                            this.inputType === 'text' ? 'Zip' : 'Area'
                          } Instant`}</button>
                          <button
                            onClick={(e: any) => {
                              const wrapper = (e.target as HTMLElement).closest('.input-bubble');
                              const inputEl = wrapper.querySelector('input') as HTMLInputElement;
                              this.handleInputSubmit(inputEl.value);
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {m.input && m.inputType === 'house_hold' && (
                        <div class="input-bubble">
                          <p class="input-label">Person 1</p>
                          <input
                            type="number"
                            placeholder={m.placeholder}
                            onInput={(e: any) => this.validateAge(e)}
                            onKeyDown={(e: any) => e.key === 'Enter' && this.handleInputSubmit(e.target.value)}
                          />
                          <button
                            onClick={(e: any) => {
                              const wrapper = (e.target as HTMLElement).closest('.input-bubble');
                              const inputEl = wrapper.querySelector('input') as HTMLInputElement;
                              this.handleInputSubmit(inputEl.value);
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
                            onClick={(e: any) => {
                              const wrapper = (e.target as HTMLElement).closest('.input-bubble');
                              const inputEl = wrapper.querySelector('input') as HTMLInputElement;
                              this.handleResult('Show Result');
                            }}
                          >
                            Show Result
                          </button>
                        </div>
                      )}

                      {m.input && m.inputType === 'rent' && (
                        <div class="input-bubble">
                          <input type="number" placeholder={m.placeholder} onKeyDown={(e: any) => e.key === 'Enter' && this.handleInputSubmit(e.target.value)} />
                          <button
                            onClick={(e: any) => {
                              const wrapper = (e.target as HTMLElement).closest('.input-bubble');
                              const inputEl = wrapper.querySelector('input') as HTMLInputElement;
                              this.handleInputSubmit(inputEl.value);
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {m.input && m.inputType === 'income' && (
                        <div class="panel-box">
                          <p class="panel-title">Income Source 2</p>

                          <div class="panel-field">
                            <input type="text" placeholder="Occupation" value={this.incomeOccupation} onInput={(e: any) => (this.incomeOccupation = e.target.value)} />
                          </div>

                          <div class="panel-field dropdown">
                            <select onInput={(e: Event) => (this.incomeFrequency = (e.target as HTMLSelectElement).value)}>
                              <option value="">Pay Frequency</option>
                              <option value="weekly">Weekly</option>
                              <option value="biweekly">Bi-Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                            <span class="caret"></span>
                          </div>

                          <div class="panel-field">
                            <input type="number" placeholder="Amount" value={this.incomeAmount} onInput={(e: any) => (this.incomeAmount = e.target.value)} />
                          </div>

                          <div class="panel-field dropdown">
                            <select onInput={(e: Event) => (this.incomeType = (e.target as HTMLSelectElement).value)}>
                              <option value="">Income Type</option>
                              <option value="salary">Salary</option>
                              <option value="bonus">Bonus</option>
                              <option value="commission">Commission</option>
                            </select>
                            <span class="caret"></span>
                          </div>

                          <button
                            class="panel-button"
                            onClick={() => this.handleInputSubmit(`${this.incomeOccupation} | ${this.incomeFrequency} | ${this.incomeAmount} | ${this.incomeType}`)}
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
              <input value={this.input} onInput={(e: any) => (this.input = e.target.value)} placeholder="Type Here" />

              <button class="send" onClick={() => this.onSend()} aria-label="Send">
                ➤
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
