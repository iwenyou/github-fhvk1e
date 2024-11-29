import { supabase } from '../lib/supabase';
import { z } from 'zod';
import { showError } from '../utils/notifications';
import { logError, logInfo, logDebug } from '../utils/logger';
import { Space } from '../types/quote';

const QuoteSchema = z.object({
  client_name: z.string().min(1, "Client name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  project_name: z.string().min(1, "Project name is required"),
  installation_address: z.string().min(1, "Installation address is required"),
  status: z.enum(['draft', 'pending', 'approved', 'rejected']).default('draft'),
  total: z.number().positive("Total must be greater than 0"),
  adjustment_type: z.enum(['discount', 'surcharge']).optional(),
  adjustment_percentage: z.number().min(0).max(100).optional(),
  adjusted_total: z.number().positive().optional(),
});

export type CreateQuoteInput = z.infer<typeof QuoteSchema>;

export async function createQuote(quoteData: CreateQuoteInput & { spaces?: Space[] }) {
  const context = 'createQuote';
  try {
    logDebug(context, 'Starting quote creation', { quoteData });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    logDebug(context, 'User authenticated', { userId: user.id, role: user.user_metadata?.role });

    const { spaces, ...quoteDataWithoutSpaces } = quoteData;
    const validatedData = QuoteSchema.parse(quoteDataWithoutSpaces);

    // Start a transaction
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert([{
        ...validatedData,
        user_id: user.id
      }])
      .select()
      .single();

    if (quoteError) {
      logError(context, quoteError, { 
        message: 'Failed to create quote',
        userData: { id: user.id, role: user.user_metadata?.role },
        validatedData 
      });
      throw quoteError;
    }

    // Insert spaces and items if provided
    if (spaces && spaces.length > 0) {
      for (const space of spaces) {
        const { data: spaceData, error: spaceError } = await supabase
          .from('spaces')
          .insert([{
            quote_id: quote.id,
            name: space.name
          }])
          .select()
          .single();

        if (spaceError) {
          logError(context, spaceError, { message: 'Failed to create space' });
          throw spaceError;
        }

        if (space.items && space.items.length > 0) {
          const items = space.items.map(item => ({
            space_id: spaceData.id,
            product_id: item.productId,
            material: item.material,
            width: item.width,
            height: item.height,
            depth: item.depth,
            price: item.price
          }));

          const { error: itemsError } = await supabase
            .from('items')
            .insert(items);

          if (itemsError) {
            logError(context, itemsError, { message: 'Failed to create items' });
            throw itemsError;
          }
        }
      }
    }

    logInfo(context, 'Quote created successfully', { quoteId: quote.id });
    return quote;
  } catch (error) {
    const errorDetails = logError(context, error);
    throw new Error(`Failed to create quote: ${errorDetails.message}`);
  }
}

// Rest of the quotes service remains the same