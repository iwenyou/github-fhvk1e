import React from 'react';

interface Columns {
  spaceName: boolean;
  productType: boolean;
  partName: boolean;
  materialName: boolean;
  dimensions: boolean;
  quantity: boolean;
  price: boolean;
  total: boolean;
}

interface ColumnsFormProps {
  columns: Columns;
  onChange: (columns: Columns) => void;
}

export function ColumnsForm({ columns, onChange }: ColumnsFormProps) {
  const columnLabels = {
    spaceName: 'Space Name',
    productType: 'Product Type',
    partName: 'Part Name',
    materialName: 'Material',
    dimensions: 'Dimensions',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total'
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Visible Columns</h3>
      <p className="text-sm text-gray-500">
        Select which columns should appear on the receipt
      </p>

      <div className="space-y-4">
        {Object.entries(columns).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={value}
              onChange={(e) =>
                onChange({ ...columns, [key]: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor={key}
              className="ml-2 block text-sm text-gray-900"
            >
              {columnLabels[key as keyof typeof columnLabels]}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}