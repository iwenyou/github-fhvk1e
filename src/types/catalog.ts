export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  type: string;
  materials: string[];
  unitCost: number;
  description?: string;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
}

export interface Material {
  id: string;
  name: string;
  description?: string;
}