import React from 'react';

export function QuoteSummary() {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h2>
      
      <div className="space-y-4">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">$0.00</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Tax (13%)</span>
            <span className="text-gray-900">$0.00</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">$0.00</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-indigo-600">$0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}