import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as quotesService from '../services/quotes.service';

export function useQuotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getQuotes = useCallback(async () => {
    if (!user) return [];
    
    try {
      setLoading(true);
      setError(null);
      return await quotesService.getQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getQuoteById = useCallback(async (id: string) => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);
      return await quotesService.getQuoteById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createQuote = useCallback(async (data: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await quotesService.createQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quote');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateQuote = useCallback(async (id: string, data: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await quotesService.updateQuote(id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quote');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteQuote = useCallback(async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      await quotesService.deleteQuote(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quote');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    getQuotes,
    getQuoteById,
    createQuote,
    updateQuote,
    deleteQuote,
    loading,
    error
  };
}