import { supabase } from '../lib/supabase';
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'sales', 'visitor']).default('visitor'),
});

export async function signUp(email: string, password: string, role: 'admin' | 'sales' | 'visitor' = 'visitor') {
  try {
    const { email: validEmail, password: validPassword, role: validRole } = UserSchema.parse({
      email,
      password,
      role,
    });

    const { data, error } = await supabase.auth.signUp({
      email: validEmail,
      password: validPassword,
      options: {
        data: {
          role: validRole,
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { email: validEmail, password: validPassword } = UserSchema.parse({
      email,
      password,
      role: 'visitor', // Role not needed for sign in
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validEmail,
      password: validPassword,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: 'admin' | 'sales' | 'visitor') {
  try {
    const { role: validRole } = UserSchema.parse({
      email: 'dummy@example.com', // Not used but required by schema
      password: 'dummy123', // Not used but required by schema
      role,
    });

    const { data, error } = await supabase
      .from('users')
      .update({ role: validRole })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    throw error;
  }
}