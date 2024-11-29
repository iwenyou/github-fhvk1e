import React, { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { ProductType } from '../../types/catalog';
import { SettingsModal } from './SettingsModal';

interface TypeListProps {
  types: ProductType[];
  onSave: (type: ProductType) => void;
  onDelete: (id: string) => void;
}

export function TypeList({ types, onSave, onDelete }: TypeListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);

  const handleEdit = (type: ProductType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleSave = (type: ProductType) => {
    onSave(type);
    setIsModalOpen(false);
    setEditingType(null);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Product Types</h2>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Type
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {types.map((type) => (
            <div
              key={type.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">{type.name}</h3>
                {type.description && (
                  <p className="text-sm text-gray-500">{type.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(type)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this type?')) {
                      onDelete(type.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {types.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No types found. Add one to get started.
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingType(null);
        }}
        onSave={handleSave}
        item={editingType}
        title={editingType ? 'Edit Type' : 'Add Type'}
        nameLabel="Type Name"
      />
    </>
  );
}