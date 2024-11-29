import React, { useState, useEffect } from 'react';
import { X, Plus, X as XIcon } from 'lucide-react';
import { Product, Category, ProductType, Material } from '../../types/catalog';
import { getProductTypes, getMaterials } from '../../services/catalogService';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null;
  categories: Category[];
}

const defaultProduct: Product = {
  id: '',
  name: '',
  categoryId: '',
  type: 'default',
  materials: ['default'],
  unitCost: 299.99,
  description: ''
};

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>(defaultProduct);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<Material[]>([]);

  useEffect(() => {
    setTypes(getProductTypes());
    setAvailableMaterials(getMaterials());
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        type: product.type,
        materials: product.materials || ['default'],
        unitCost: product.unitCost,
        description: product.description || ''
      });
    } else {
      setFormData({
        ...defaultProduct,
        categoryId: categories[0]?.id || ''
      });
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, 'default']
    });
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    });
  };

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData({
      ...formData,
      materials: newMaterials
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative bg-white rounded-lg max-w-lg w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {product ? 'Edit Product' : 'Add Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="default">Default</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Materials
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="inline-flex items-center px-2 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Material
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.materials.map((material, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        value={material}
                        onChange={(e) => handleMaterialChange(index, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="default">Default</option>
                        {availableMaterials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      {formData.materials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Cost ($)
                </label>
                <input
                  type="number"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {product ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}