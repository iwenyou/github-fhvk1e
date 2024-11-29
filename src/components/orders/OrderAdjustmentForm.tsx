import React from 'react';

interface OrderAdjustmentFormProps {
  type: 'discount' | 'surcharge';
  percentage: number;
  onTypeChange: (type: 'discount' | 'surcharge') => void;
  onPercentageChange: (percentage: number) => void;
  onApply: () => void;
}

export function OrderAdjustmentForm({
  type,
  percentage,
  onTypeChange,
  onPercentageChange,
  onApply
}: OrderAdjustmentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as 'discount' | 'surcharge')}
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
            value={percentage}
            onChange={(e) => onPercentageChange(Number(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <span className="ml-2">%</span>
        </div>
      </div>

      <button
        onClick={onApply}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Apply Adjustment
      </button>
    </div>
  );
}