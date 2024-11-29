import { Space } from '../types/quote';

export interface QuoteData {
  id?: string;
  clientName: string;
  email: string;
  phone: string;
  projectName: string;
  installationAddress: string;
  spaces: Space[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  total: number;
}

export function generateQuote(data: QuoteData): QuoteData {
  const quote: QuoteData = {
    ...data,
    id: crypto.randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const quotes = getAllQuotes();
  quotes.push(quote);
  localStorage.setItem('quotes', JSON.stringify(quotes));

  return quote;
}

export function saveDraft(data: QuoteData): QuoteData {
  const draft: QuoteData = {
    ...data,
    id: crypto.randomUUID(),
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const quotes = getAllQuotes();
  quotes.push(draft);
  localStorage.setItem('quotes', JSON.stringify(quotes));

  return draft;
}

export function getAllQuotes(): QuoteData[] {
  return JSON.parse(localStorage.getItem('quotes') || '[]');
}

export function getQuoteById(id: string): QuoteData | undefined {
  const quotes = getAllQuotes();
  return quotes.find(quote => quote.id === id);
}

export function updateQuote(id: string, updates: Partial<QuoteData>): QuoteData {
  const quotes = getAllQuotes();
  const index = quotes.findIndex(quote => quote.id === id);
  
  if (index === -1) {
    throw new Error('Quote not found');
  }

  const updatedQuote: QuoteData = {
    ...quotes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  quotes[index] = updatedQuote;
  localStorage.setItem('quotes', JSON.stringify(quotes));

  return updatedQuote;
}

export function deleteQuote(id: string): void {
  const quotes = getAllQuotes();
  const filteredQuotes = quotes.filter(quote => quote.id !== id);
  localStorage.setItem('quotes', JSON.stringify(filteredQuotes));
}