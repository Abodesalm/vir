import { Document } from '../types';

const HISTORY_KEY = 'document_history';
const MAX_HISTORY = 10;

export interface DocumentHistory {
  document: Document;
  selectedType: string;
  timestamp: number;
}

export function addToHistory(document: Document, selectedType: string) {
  const history = getHistory();
  const newEntry: DocumentHistory = {
    document,
    selectedType,
    timestamp: Date.now(),
  };
  
  history.unshift(newEntry);
  
  if (history.length > MAX_HISTORY) {
    history.pop();
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): DocumentHistory[] {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getLastDocument(): DocumentHistory | null {
  const history = getHistory();
  return history.length > 0 ? history[0] : null;
}

export function removeLastFromHistory() {
  const history = getHistory();
  if (history.length > 0) {
    history.shift();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}