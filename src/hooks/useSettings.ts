import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as settingsService from '../services/settings.service';

export function useSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getPresetValues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await settingsService.getPresetValues();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch preset values');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePresetValues = useCallback(async (values: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await settingsService.updatePresetValues(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preset values');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getTemplateSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      return await settingsService.getTemplateSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch template settings');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTemplateSettings = useCallback(async (settings: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);
      return await settingsService.updateTemplateSettings(settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template settings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    getPresetValues,
    updatePresetValues,
    getTemplateSettings,
    updateTemplateSettings,
    loading,
    error
  };
}