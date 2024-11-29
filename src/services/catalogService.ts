import { Category, Product, ProductType, Material } from '../types/catalog';

// Initialize with some default data
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Base Cabinet',
    categoryId: '1',
    type: 'base',
    materials: ['1'],
    unitCost: 299.99,
    description: 'Standard base cabinet'
  }
];

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Kitchen Cabinets',
    description: 'Kitchen cabinet collection'
  }
];

const defaultMaterials: Material[] = [
  {
    id: '1',
    name: 'Solid Wood',
    description: 'Premium solid wood material'
  }
];

export function getCategories(): Category[] {
  const stored = localStorage.getItem('categories');
  if (!stored) {
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  return JSON.parse(stored);
}

export function saveCategory(category: Category): void {
  const categories = getCategories();
  if (!category.id) {
    category.id = crypto.randomUUID();
    categories.push(category);
  } else {
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories[index] = category;
    }
  }
  localStorage.setItem('categories', JSON.stringify(categories));
}

export function deleteCategory(id: string): void {
  const categories = getCategories().filter(c => c.id !== id);
  localStorage.setItem('categories', JSON.stringify(categories));
}

export function getProducts(): Product[] {
  const stored = localStorage.getItem('products');
  if (!stored) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
}

export function saveProduct(product: Product): void {
  const products = getProducts();
  if (!product.id) {
    product.id = crypto.randomUUID();
    products.push(product);
  } else {
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
    }
  }
  localStorage.setItem('products', JSON.stringify(products));
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(products));
}

export function getProductTypes(): ProductType[] {
  return JSON.parse(localStorage.getItem('productTypes') || '[]');
}

export function saveProductType(type: ProductType): void {
  const types = getProductTypes();
  if (!type.id) {
    type.id = crypto.randomUUID();
    types.push(type);
  } else {
    const index = types.findIndex(t => t.id === type.id);
    if (index !== -1) {
      types[index] = type;
    }
  }
  localStorage.setItem('productTypes', JSON.stringify(types));
}

export function deleteProductType(id: string): void {
  const types = getProductTypes().filter(t => t.id !== id);
  localStorage.setItem('productTypes', JSON.stringify(types));
}

export function getMaterials(): Material[] {
  const stored = localStorage.getItem('materials');
  if (!stored) {
    localStorage.setItem('materials', JSON.stringify(defaultMaterials));
    return defaultMaterials;
  }
  return JSON.parse(stored);
}

export function saveMaterial(material: Material): void {
  const materials = getMaterials();
  if (!material.id) {
    material.id = crypto.randomUUID();
    materials.push(material);
  } else {
    const index = materials.findIndex(m => m.id === material.id);
    if (index !== -1) {
      materials[index] = material;
    }
  }
  localStorage.setItem('materials', JSON.stringify(materials));
}

export function deleteMaterial(id: string): void {
  const materials = getMaterials().filter(m => m.id !== id);
  localStorage.setItem('materials', JSON.stringify(materials));
}