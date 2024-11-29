import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Adjustment {
  type: 'discount' | 'surcharge';
  name: string;
  percentage: number;
}

interface AdjustmentsFormProps {
  adjustments: Adjustment[];
  onChange: (adjustments: Adjustment[]) => void;
}

export function AdjustmentsForm({ adjustments, onChange }: AdjustmentsFormProps) {
  const handleAdd = () => {
    onChange([
      ...adjustments,
      { type: 'discount', name: 'New Adjustment', percentage: 0 }
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(adjustments.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, updates: Partial<Adjustment>) => {
    onChange(
      adjustments.map((adjustment, i) =>
        i === index ? { ...adjustment, ...updates } : adjustment
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Price Adjustments</h3>
          <p className="text-sm text-gray-500">
            Define default adjustments that can be applied to receipts
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Adjustment
        </button>
      </div>

      <div className="space-y-4">
        {adjustments.map((adjustment, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={adjustment.name}
                  onChange={(e) =>
                    handleUpdate(index, { name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={adjustment.type}
                  onChange={(e) =>
                    handleUpdate(index, {
                      type: e.target.value as 'discount' | 'surcharge'
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="discount">Discount</option>
                  <option value="surcharge">Surcharge</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Percentage
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={adjustment.percentage}
                    onChange={(e) =>
                      handleUpdate(index, {
                        percentage: Number(e.target.value)
                      })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="mt-4 text-sm text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4 inline-block mr-1" />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}