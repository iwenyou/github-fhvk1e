import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/user';
import { showSuccess, showError } from '../utils/toast';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;
      showSuccess('User deleted successfully');
      await fetchUsers();
    } catch (error) {
      showError(error);
    }
  }, [fetchUsers]);

  const updateUserRole = useCallback(async (userId: string, role: 'admin' | 'sales' | 'visitor') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      showSuccess('User role updated successfully');
      await fetchUsers();
    } catch (error) {
      showError(error);
    }
  }, [fetchUsers]);

  return {
    users,
    loading,
    fetchUsers,
    deleteUser,
    updateUserRole
  };
}