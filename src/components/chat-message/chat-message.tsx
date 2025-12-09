import { Component, h, Prop,EventEmitter, Event } from '@stencil/core';

@Component({
  tag: 'chat-message',
  styleUrl: 'chat-message.css',
  shadow: false
})
export class ChatMessage {
  @Prop() msg: any;
  @Event() handleOption: EventEmitter<string>;

  private onOptionClick(optId: string) {
    // Emit the event to the parent
    this.handleOption.emit(optId);
  }
  render() {
    console.log("msg", this.msg)
    const m = this.msg;
    const isBot = m.from === 'bot';
    // card style detection
    const isCard = m.type === 'card' || (m.text?.length > 80 && isBot);
    return (
      <div class={`message-row ${isBot ? 'bot' : 'user'}`}>
        {isBot && <img class="avatar" src="/assets/bot-avatar.png" alt="bot" />}
        {/* <div class={`bubble ${isCard ? 'card' : ''}`}>
          <div class="bubble-text" innerHTML={formatText(m.text)}></div>
          {m.actions && (
            <div class="actions">
              {m.actions.map((a:string) => <button class="chip">{a}</button>)}
            </div>
          )}
        </div> */}
            <div class={m.type === 'bot' ? 'msg-bot' : 'msg-user'}>
                 <div class="bubble"><p>{m.message}</p>
                 {m.options && (
                   <div class="options-row">
                     {m.options.map((opt: any) => (
                      <button class="option-btn" onClick={() => this.onOptionClick(opt.id)}>{opt.label}</button>
                    ))}
                  </div>
                )}
                </div>
              </div>


        {!isBot && <div class="user-pill">SL</div>}
      </div>
    );
  }
}

function formatText(text: string){
  if(!text) return '';
  // basic newline conversion to <br>
  const escaped = text.replace(/\n/g, '<br/>');
  return escaped;
}
