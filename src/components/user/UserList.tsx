import React from 'react';
import { Trash2 } from 'lucide-react';
import { User } from '../../types/user';

interface UserListProps {
  users: User[];
  onUpdateRole: (userId: string, role: 'admin' | 'sales' | 'visitor') => void;
  onDeleteUser: (userId: string) => void;
}

export function UserList({ users, onUpdateRole, onDeleteUser }: UserListProps) {
  return (
    <ul className="divide-y divide-gray-200">
      {users.map((user) => (
        <li key={user.id} className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{user.email}</h3>
              <p className="text-sm text-gray-500">Created: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={user.role}
                onChange={(e) => onUpdateRole(user.id, e.target.value as 'admin' | 'sales' | 'visitor')}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="visitor">Visitor</option>
              </select>
              <button
                onClick={() => onDeleteUser(user.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}