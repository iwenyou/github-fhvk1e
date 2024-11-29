import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as catalogService from '../services/catalog.service';

export function useCatalog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await catalogService.getCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await catalogService.createCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await catalogService.getProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: any, materialIds: string[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await catalogService.createProduct(productData, materialIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await catalogService.getMaterials();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch materials');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createMaterial = useCallback(async (data: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await catalogService.createMaterial(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create material');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    getCategories,
    createCategory,
    getProducts,
    createProduct,
    getMaterials,
    createMaterial,
    loading,
    error
  };
}