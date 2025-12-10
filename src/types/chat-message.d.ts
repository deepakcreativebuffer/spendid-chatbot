
export {};

declare global {
  interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    ts: number;
  }
}
