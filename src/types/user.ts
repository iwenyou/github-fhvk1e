export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'sales' | 'visitor';
  created_at: string;
}

export interface UserFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Unknown';
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name) return user.first_name;
  if (user.last_name) return user.last_name;
  return user.email;
};