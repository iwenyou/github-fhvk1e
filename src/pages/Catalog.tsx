import React, { useState, useEffect } from 'react';
import { CategoryList } from '../components/catalog/CategoryList';
import { TypeList } from '../components/catalog/TypeList';
import { MaterialList } from '../components/catalog/MaterialList';
import { CatalogTable } from '../components/catalog/CatalogTable';
import { Category, Product, ProductType, Material } from '../types/catalog';
import {
  getCategories,
  saveCategory,
  deleteCategory,
  getProducts,
  saveProduct,
  deleteProduct,
  getProductTypes,
  saveProductType,
  deleteProductType,
  getMaterials,
  saveMaterial,
  deleteMaterial,
} from '../services/catalogService';

export function Catalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    setCategories(getCategories());
    setProducts(getProducts());
    setTypes(getProductTypes());
    setMaterials(getMaterials());
  }, []);

  const handleSaveCategory = (category: Category) => {
    saveCategory(category);
    setCategories(getCategories());
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    setCategories(getCategories());
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
  };

  const handleSaveProduct = (product: Product) => {
    saveProduct(product);
    setProducts(getProducts());
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    setProducts(getProducts());
  };

  const handleSaveType = (type: ProductType) => {
    saveProductType(type);
    setTypes(getProductTypes());
  };

  const handleDeleteType = (id: string) => {
    deleteProductType(id);
    setTypes(getProductTypes());
  };

  const handleSaveMaterial = (material: Material) => {
    saveMaterial(material);
    setMaterials(getMaterials());
  };

  const handleDeleteMaterial = (id: string) => {
    deleteMaterial(id);
    setMaterials(getMaterials());
  };

  const filteredProducts = selectedCategoryId
    ? products.filter((product) => product.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="mt-2 text-gray-600">
            Manage your cabinet products and categories
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <CatalogTable
          products={filteredProducts}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryList
            categories={categories}
            onSave={handleSaveCategory}
            onDelete={handleDeleteCategory}
            onSelect={setSelectedCategoryId}
            selectedCategoryId={selectedCategoryId}
          />
          <TypeList
            types={types}
            onSave={handleSaveType}
            onDelete={handleDeleteType}
          />
          <MaterialList
            materials={materials}
            onSave={handleSaveMaterial}
            onDelete={handleDeleteMaterial}
          />
        </div>
      </div>
    </div>
  );
}