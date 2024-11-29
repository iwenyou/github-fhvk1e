import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as ordersService from '../services/orders.service';

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getOrders = useCallback(async () => {
    if (!user) return [];
    
    try {
      setLoading(true);
      setError(null);
      return await ordersService.getOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getOrderById = useCallback(async (id: string) => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);
      return await ordersService.getOrderById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createOrder = useCallback(async (data: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await ordersService.createOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createReceipt = useCallback(async (data: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await ordersService.createReceipt(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create receipt');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateReceiptStatus = useCallback(async (id: string, status: 'sent') => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await ordersService.updateReceiptStatus(id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update receipt status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    getOrders,
    getOrderById,
    createOrder,
    createReceipt,
    updateReceiptStatus,
    loading,
    error
  };
}