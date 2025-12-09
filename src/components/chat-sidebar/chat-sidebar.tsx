import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'chat-sidebar',
  styleUrl: 'chat-sidebar.css',
  shadow: false,
})
export class ChatSidebar {
  @Prop() threads: any[] = [];
  @Prop() active: string;

  @Event() newThread: EventEmitter<void>;

  select(id: string) {
    const ev = new CustomEvent('selectThread', { detail: id });
    window.dispatchEvent(ev);
  }
  formatTimestamp(ts: number): string {
    const now = new Date();
    const date = new Date(ts);

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    // 1️⃣ Within 2 minutes → show "now"
    if (diffMinutes <= 2) return 'now';

    // Normalize to midnight for day comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // 2️⃣ Still today → show "today"
    if (date >= today) return 'today';

    // 3️⃣ Yesterday → show "yesterday"
    if (date >= yesterday && date < today) return 'yesterday';

    // 4️⃣ Anything older → return "4 Dec" format
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  }

  render() {
    return (
      <aside class="sidebar">
        <div class="brand">
          <img src="/assets/icon/logo.svg" alt="logo" />
          <span class="brand-text">SPENDiD AI</span>
        </div>

        <div class="divider"></div>

        <ul class="thread-list">
          {this.threads?.map(t => (
            <li class={`thread ${t.id === this.active ? 'active' : ''}`} onClick={() => this.select(t.id)}>
              <div class="title">{t.name}</div>
              <div class="meta">{t.ts ? this.formatTimestamp(t.ts) : '12312'}</div>
            </li>
          ))}
        </ul>

        <div class="bottom">
          <button class="new-btn" onClick={() => this.newThread.emit()}>
            + New Analysis
          </button>
        </div>
      </aside>
    );
  }
}
