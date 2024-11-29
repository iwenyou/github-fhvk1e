import React, { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Material } from '../../types/catalog';
import { SettingsModal } from './SettingsModal';

interface MaterialListProps {
  materials: Material[];
  onSave: (material: Material) => void;
  onDelete: (id: string) => void;
}

export function MaterialList({ materials, onSave, onDelete }: MaterialListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMaterial(null);
    setIsModalOpen(true);
  };

  const handleSave = (material: Material) => {
    onSave(material);
    setIsModalOpen(false);
    setEditingMaterial(null);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Materials</h2>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Material
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {materials.map((material) => (
            <div
              key={material.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">{material.name}</h3>
                {material.description && (
                  <p className="text-sm text-gray-500">{material.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(material)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this material?')) {
                      onDelete(material.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {materials.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No materials found. Add one to get started.
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMaterial(null);
        }}
        onSave={handleSave}
        item={editingMaterial}
        title={editingMaterial ? 'Edit Material' : 'Add Material'}
        nameLabel="Material Name"
      />
    </>
  );
}