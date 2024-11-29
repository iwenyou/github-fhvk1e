import React from 'react';

interface OrderTotalsProps {
  subtotal: number;
  adjustmentType?: 'discount' | 'surcharge';
  adjustmentPercentage?: number;
  adjustedTotal?: number;
}

export function OrderTotals({
  subtotal,
  adjustmentType,
  adjustmentPercentage,
  adjustedTotal
}: OrderTotalsProps) {
  const adjustmentAmount = adjustedTotal ? Math.abs(adjustedTotal - subtotal) : 0;

  return (
    <dl className="space-y-3">
      <div className="flex justify-between text-sm">
        <dt className="text-gray-500">Subtotal</dt>
        <dd className="text-gray-900">${subtotal.toFixed(2)}</dd>
      </div>

      {adjustmentType && adjustmentPercentage && (
        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">
            {adjustmentType === 'discount' ? 'Discount' : 'Surcharge'}{' '}
            ({adjustmentPercentage}%)
          </dt>
          <dd className="text-gray-900">
            {adjustmentType === 'discount' ? '-' : '+'}$
            {adjustmentAmount.toFixed(2)}
          </dd>
        </div>
      )}

      <div className="border-t border-gray-200 pt-3 flex justify-between">
        <dt className="text-base font-medium text-gray-900">Total</dt>
        <dd className="text-base font-medium text-indigo-600">
          ${(adjustedTotal || subtotal).toFixed(2)}
        </dd>
      </div>
    </dl>
  );
}