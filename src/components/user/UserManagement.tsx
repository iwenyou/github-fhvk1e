import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { showSuccess, showError } from '../../utils/toast';
import { UserList } from './UserList';
import { UserForm } from './UserForm';

export function UserManagementComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(profiles || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const { email, password, role } = userData;

      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role
          }
        }
      });

      if (signUpError) throw signUpError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            role
          }
        ]);

      if (profileError) throw profileError;

      showSuccess('User created successfully');
      setIsAddingUser(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      showError(error.message || 'Failed to create user');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'sales' | 'visitor') => {
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.rpc('update_user_role', {
        user_id: userId,
        new_role: newRole
      });

      if (authError) throw authError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (profileError) throw profileError;

      showSuccess('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      showError(error.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error: deleteError } = await supabase.rpc('delete_user', {
        user_id: userId
      });

      if (deleteError) throw deleteError;

      showSuccess('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showError(error.message || 'Failed to delete user');
    }
  };

  if (!currentUser?.user_metadata?.role || currentUser.user_metadata.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage user accounts and permissions
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setIsAddingUser(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add User
            </button>
          </div>

          <UserList
            users={users}
            onUpdateRole={handleUpdateRole}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>

      {isAddingUser && (
        <UserForm
          onSubmit={handleAddUser}
          onCancel={() => setIsAddingUser(false)}
        />
      )}
    </div>
  );
}