export const STORAGE_KEY = 'spendid-chat-data';

export async function loadInitialData() {
  const ls = localStorage.getItem(STORAGE_KEY);
  if (ls) return JSON.parse(ls);
  const res = await fetch('/assets/data.json');
  const json = await res.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
  return json;
}

export function saveData(data: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
