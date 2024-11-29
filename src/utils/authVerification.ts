import { supabase } from '../lib/supabase';
import { logError, logDebug } from './logger';

export async function verifyAuthRole() {
  const context = 'verifyAuthRole';
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session) {
      logDebug(context, 'No active session found');
      return { verified: false, error: 'No active session' };
    }

    const role = session.user?.user_metadata?.role;
    logDebug(context, 'User role from metadata', { role });

    if (!role || !['admin', 'sales'].includes(role)) {
      return { verified: false, error: 'Invalid or missing role' };
    }

    return { verified: true, role };
  } catch (error) {
    logError(context, error);
    return { verified: false, error: 'Verification failed' };
  }
}

export async function testQuoteInsertion() {
  const context = 'testQuoteInsertion';
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    const testQuote = {
      client_name: 'Test Client',
      email: 'test@example.com',
      phone: '555-0123',
      project_name: 'Test Project',
      installation_address: 'Test Address',
      total: 100,
      user_id: user.id,
      created_by: user.id
    };

    const { data, error: insertError } = await supabase
      .from('quotes')
      .insert([testQuote])
      .select()
      .single();

    if (insertError) {
      logError(context, insertError);
      return { success: false, error: insertError.message };
    }

    // Clean up
    if (data?.id) {
      await supabase.from('quotes').delete().eq('id', data.id);
    }

    return { success: true };
  } catch (error) {
    logError(context, error);
    return { success: false, error: 'Test failed' };
  }
}

export async function testOrderInsertion() {
  const context = 'testOrderInsertion';
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    const testOrder = {
      client_name: 'Test Client',
      email: 'test@example.com',
      phone: '555-0123',
      project_name: 'Test Project',
      installation_address: 'Test Address',
      total: 100,
      user_id: user.id,
      created_by: user.id,
      status: 'pending'
    };

    const { data, error: insertError } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()
      .single();

    if (insertError) {
      logError(context, insertError);
      return { success: false, error: insertError.message };
    }

    // Clean up
    if (data?.id) {
      await supabase.from('orders').delete().eq('id', data.id);
    }

    return { success: true };
  } catch (error) {
    logError(context, error);
    return { success: false, error: 'Test failed' };
  }
}

export async function testReceiptInsertion() {
  const context = 'testReceiptInsertion';
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    // First create a test order
    const testOrder = {
      client_name: 'Test Client',
      email: 'test@example.com',
      phone: '555-0123',
      project_name: 'Test Project',
      installation_address: 'Test Address',
      total: 100,
      user_id: user.id,
      created_by: user.id,
      status: 'pending'
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()
      .single();

    if (orderError) {
      logError(context, orderError);
      return { success: false, error: 'Failed to create test order' };
    }

    const testReceipt = {
      order_id: orderData.id,
      payment_percentage: 50,
      amount: 50,
      status: 'draft'
    };

    const { error: receiptError } = await supabase
      .from('receipts')
      .insert([testReceipt]);

    if (receiptError) {
      logError(context, receiptError);
      return { success: false, error: receiptError.message };
    }

    // Clean up
    await supabase.from('orders').delete().eq('id', orderData.id);

    return { success: true };
  } catch (error) {
    logError(context, error);
    return { success: false, error: 'Test failed' };
  }
}

export async function testCatalogAccess() {
  const context = 'testCatalogAccess';
  try {
    // For non-admin users, we only test read access
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      logError(context, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    logError(context, error);
    return { success: false, error: 'Test failed' };
  }
}

export async function testTemplateAccess() {
  const context = 'testTemplateAccess';
  try {
    const { data, error } = await supabase
      .from('template_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      logError(context, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    logError(context, error);
    return { success: false, error: 'Test failed' };
  }
}

export async function testPresetValuesAccess() {
  const context = 'testPresetValuesAccess';
  try {
    const { data, error } = await supabase
      .from('preset_values')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      logError(context, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    logError(context, error);
    return { success: false, error: 'Test failed' };
  }
}