import { supabase } from '../lib/supabase';
import { z } from 'zod';

const CategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const ProductSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(1),
  type: z.string().min(1),
  unit_cost: z.number().positive(),
  description: z.string().optional(),
});

const MaterialSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
}

export async function createCategory(categoryData: z.infer<typeof CategorySchema>) {
  try {
    const validatedData = CategorySchema.parse(categoryData);

    const { data, error } = await supabase
      .from('categories')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error;
  }
}

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        materials:product_materials(
          material:materials(*)
        )
      `)
      .order('name');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}

export async function createProduct(
  productData: z.infer<typeof ProductSchema>,
  materialIds: string[]
) {
  try {
    const validatedData = ProductSchema.parse(productData);

    // Start a transaction
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([validatedData])
      .select()
      .single();

    if (productError) throw productError;

    // Insert product-material relationships
    if (materialIds.length > 0) {
      const productMaterials = materialIds.map(materialId => ({
        product_id: product.id,
        material_id: materialId,
      }));

      const { error: materialsError } = await supabase
        .from('product_materials')
        .insert(productMaterials);

      if (materialsError) throw materialsError;
    }

    return product;
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
}

export async function getMaterials() {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getMaterials:', error);
    throw error;
  }
}

export async function createMaterial(materialData: z.infer<typeof MaterialSchema>) {
  try {
    const validatedData = MaterialSchema.parse(materialData);

    const { data, error } = await supabase
      .from('materials')
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in createMaterial:', error);
    throw error;
  }
}