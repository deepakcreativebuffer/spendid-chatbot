import { Component, h, State } from '@stencil/core';
import { loadInitialData, saveData } from '../../utils/store';

@Component({
  tag: 'chat-app',
  styleUrl: 'chat-app.css',
  shadow: false,
})
export class ChatApp {
  @State() data: any = { threads: [] };
  @State() activeThreadId: string = '';
  @State() showResultScreen: boolean = false;

  async componentWillLoad() {
    this.data = await loadInitialData();

    // If no threads exist, create one
    if (!this.data.threads?.length) {
      console.log('asdasdtest>>>>>>>>>');
      this.createNewThread();
    }

    this.activeThreadId = this.data.threads?.[0]?.id || '';

    window.addEventListener('selectThread', (e: any) => {
      this.activeThreadId = e.detail;
    });

    window.addEventListener('newThread', () => {
      this.createNewThread();
    });
  }
  createNewThread = () => {
    const newThread = {
      id: 't' + Date.now(),
      title: 'New Analysis',
      text: '',
      ts: Date.now(),
    };

    this.data.threads.unshift(newThread);
    this.activeThreadId = newThread.id;

    saveData(this.data);
    this.data = { ...this.data };
  };

  handleSendMessage(msg: { text: string; ts: number }) {
    console.log('msg-chat-message', msg);

    // 1. FIND ACTIVE THREAD
    let thread = this.data.threads?.find(t => t.id === this.activeThreadId);

    // 2. IF NO ACTIVE THREAD → CREATE NEW THREAD AUTOMATICALLY
    if (!thread) {
      const id = 't' + Date.now();
      thread = {
        id,
        name: 'New Analysis',
        text: '',
        ts: Date.now(),
      };
      this.data.threads?.unshift(thread);
      this.activeThreadId = id;
    }

    // 3. RENAME THREAD BASED ON FIRST MESSAGE
    if (thread.messages.length === 0) {
      const shortTitle = msg.text.length > 20 ? msg.text.slice(0, 20) + '…' : msg.text;
      thread.name = shortTitle;
    }

    // 4. PUSH MESSAGE
    thread.messages?.push({
      id: 'm' + msg.ts,
      from: 'user',
      text: msg.text,
      ts: msg.ts,
    });

    // 5. SAVE + UPDATE SIDEBAR
    saveData(this.data);
  }

  render() {
    console.log('this>>', this.data);
    const active = this.data.threads?.find((t: any) => t.id === this.activeThreadId) || null;

    return (
      <div
        class={{
          'app-frame': true,
          'result-mode': this.showResultScreen,
        }}
      >
        {!this.showResultScreen && <chat-sidebar threads={this.data.threads} active={this.activeThreadId}></chat-sidebar>}

        <div class="main-area">
          <chat-screen thread={active} onSendMessage={(ev: any) => this.handleSendMessage(ev.detail)} onShowResult={(e: any) => (this.showResultScreen = e.detail)}></chat-screen>

          {this.showResultScreen && <spendid-results onCloseResult={() => (this.showResultScreen = false)}></spendid-results>}
        </div>
      </div>
    );
  }
}
