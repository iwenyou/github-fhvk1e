import React from 'react';
import { Ruler } from 'lucide-react';

export function TemplatePreview() {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Preview
      </h2>
      
      <div className="border rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Ruler className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Your Company Name</span>
          </div>
          <div className="text-sm text-gray-600 text-right">
            <p>123 Business St.</p>
            <p>City, State 12345</p>
            <p>(555) 555-5555</p>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Quote For</h3>
              <p className="mt-1">John Smith</p>
              <p className="text-gray-600">123 Client St.</p>
              <p className="text-gray-600">City, State 12345</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-500">Quote Details</h3>
              <p className="mt-1">Quote #: Q-2024-001</p>
              <p className="text-gray-600">Date: March 15, 2024</p>
              <p className="text-gray-600">Valid Until: April 14, 2024</p>
            </div>
          </div>
        </div>

        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-500 py-2">Description</th>
              <th className="text-right text-sm font-medium text-gray-500 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">
                <p className="font-medium">Base Cabinet</p>
                <p className="text-sm text-gray-600">30"H x 24"W x 24"D - Solid Wood</p>
              </td>
              <td className="text-right py-2">$599.99</td>
            </tr>
            <tr>
              <td className="py-2">
                <p className="font-medium">Wall Cabinet</p>
                <p className="text-sm text-gray-600">30"H x 24"W x 12"D - Solid Wood</p>
              </td>
              <td className="text-right py-2">$399.99</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td className="py-2 text-right font-medium">Subtotal</td>
              <td className="py-2 text-right">$999.98</td>
            </tr>
            <tr>
              <td className="py-2 text-right font-medium">Tax (13%)</td>
              <td className="py-2 text-right">$130.00</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="py-2 text-right font-medium">Total</td>
              <td className="py-2 text-right font-bold text-indigo-600">$1,129.98</td>
            </tr>
          </tfoot>
        </table>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900">Terms & Conditions</h3>
            <ul className="mt-2 text-gray-600 list-disc list-inside">
              <li>50% deposit required to begin work</li>
              <li>Balance due upon completion</li>
              <li>Delivery within 4-6 weeks</li>
              <li>Custom orders are non-refundable</li>
            </ul>
          </div>
          
          <p className="text-gray-600 italic">
            Thank you for your business. This quote is valid for 30 days.
          </p>
        </div>
      </div>
    </div>
  );
}