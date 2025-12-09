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
  @State() isBlankChat: boolean = false;
  @State() showSidebar: boolean = false;
  @State() windowWidth: number = window.innerWidth;
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
  async componentWillLoad() {
    window.addEventListener('resize', this.handleResize);

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

    // window.addEventListener('newThread', () => {
    //   this.createNewThread();
    // });
  }
  createNewThread = () => {
    const newThread = {
      id: 't' + Date.now(),
      name: 'New Analysis',
      text: '',
      messages: [],
      ts: Date.now(),
    };

    this.data.threads.unshift(newThread);
    this.activeThreadId = newThread.id;

    saveData(this.data);
    this.data = { ...this.data };
  };
  startBlankChat() {
    this.isBlankChat = true;
    this.activeThreadId = '';
  }
  handleSendMessage(msg: { text: string; ts: number; messages: any }) {
    console.log('msg-chat-message', msg);
    if (this.isBlankChat) {
      this.isBlankChat = false; // Reset blank chat flag after first message
    }
    // 1. FIND ACTIVE THREAD
    let thread = this.data.threads?.find(t => t.id === this.activeThreadId);

    // 2. IF NO ACTIVE THREAD → CREATE NEW THREAD AUTOMATICALLY
    if (!thread) {
      const id = 't' + Date.now();
      thread = {
        id,
        name: 'New Analysis',
        text: '',
        messages: [],
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
    thread.messages = [...msg.messages];

    // 5. SAVE + UPDATE SIDEBAR
    saveData(this.data);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.windowWidth = window.innerWidth;
  };

  render() {
    console.log('this>>', this.data);
    const active = this.data.threads?.find((t: any) => t.id === this.activeThreadId) || null;
    console.log('active', active);
    return (
      <div class="app-frame">
        {/* Hamburger for mobile */}
        {!this.showSidebar && this.windowWidth < 768 && (
          <button class="hamburger" onClick={() => this.toggleSidebar()}>
            &#9776;
          </button>
        )}
        {this.showSidebar && <div class="sidebar-overlay" onClick={() => (this.showSidebar = false)}></div>}
        {/* Sidebar */}
        <chat-sidebar
          class={{ show: this.showSidebar }}
          threads={this.data.threads}
          active={this.activeThreadId}
          onNewThread={() => this.startBlankChat()}
          onCloseResult={() => (this.showResultScreen = false)}
        ></chat-sidebar>

        {/* Main chat area */}
        <div class="main-area" onClick={() => (this.showSidebar = false)}>
          <chat-screen
            isBlankChat={this.isBlankChat}
            thread={this.activeThreadId ? this.data.threads.find(t => t.id === this.activeThreadId) : null}
            activeThread={this.activeThreadId}
            onSendMessage={(ev: any) => this.handleSendMessage(ev.detail)}
            onShowResult={(e: any) => (this.showResultScreen = e.detail)}
          ></chat-screen>

          {this.showResultScreen && <spendid-results onCloseResult={() => (this.showResultScreen = false)}></spendid-results>}
        </div>
      </div>
    );
  }
}
