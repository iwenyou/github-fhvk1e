import { supabase } from '../lib/supabase';
import { z } from 'zod';

const PresetValuesSchema = z.object({
  default_height: z.number().positive(),
  default_width: z.number().positive(),
  default_depth: z.number().positive(),
  labor_rate: z.number().positive(),
  material_markup: z.number().min(0).max(100),
  tax_rate: z.number().min(0).max(100),
  delivery_fee: z.number().nonnegative(),
  installation_fee: z.number().nonnegative(),
  storage_fee: z.number().nonnegative(),
  minimum_order: z.number().nonnegative(),
  rush_order_fee: z.number().min(0).max(100),
  shipping_rate: z.number().nonnegative(),
  import_tax_rate: z.number().min(0).max(100),
  exchange_rate: z.number().positive(),
});

const TemplateSettingsSchema = z.object({
  company_info: z.object({
    name: z.string(),
    logo: z.string().optional(),
    address: z.string(),
    phone: z.string(),
    email: z.string().email(),
    website: z.string().url(),
  }),
  layout: z.object({
    primary_color: z.string(),
    font_family: z.string(),
    show_logo: z.boolean(),
    show_company_info: z.boolean(),
    show_client_info: z.boolean(),
    show_project_details: z.boolean(),
    show_validity_period: z.boolean(),
    show_tax_details: z.boolean(),
    show_footer_notes: z.boolean(),
    show_contact_buttons: z.boolean(),
  }),
});

export async function getPresetValues() {
  try {
    const { data, error } = await supabase
      .from('preset_values')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getPresetValues:', error);
    throw error;
  }
}

export async function updatePresetValues(values: z.infer<typeof PresetValuesSchema>) {
  try {
    const validatedData = PresetValuesSchema.parse(values);

    const { data, error } = await supabase
      .from('preset_values')
      .upsert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updatePresetValues:', error);
    throw error;
  }
}

export async function getTemplateSettings() {
  try {
    const { data, error } = await supabase
      .from('template_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getTemplateSettings:', error);
    throw error;
  }
}

export async function updateTemplateSettings(settings: z.infer<typeof TemplateSettingsSchema>) {
  try {
    const validatedData = TemplateSettingsSchema.parse(settings);

    const { data, error } = await supabase
      .from('template_settings')
      .upsert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateTemplateSettings:', error);
    throw error;
  }
}