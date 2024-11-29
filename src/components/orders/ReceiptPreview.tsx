import React from 'react';
import { X, Building2, Phone, Mail, Globe } from 'lucide-react';
import { Order } from '../../types/order';
import { getReceiptTemplate } from '../../services/receiptService';

interface ReceiptPreviewProps {
  order: Order;
  receiptId: string;
  onClose: () => void;
}

export function ReceiptPreview({ order, receiptId, onClose }: ReceiptPreviewProps) {
  const receipt = order.receipts?.find(r => r.id === receiptId);
  const template = getReceiptTemplate();

  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Close Button */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Receipt Content */}
          <div className="bg-white p-8">
            {/* Header Section */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-start">
                {/* Company Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {template.businessInfo.name}
                  </h1>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span className="whitespace-pre-line">{template.businessInfo.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{template.businessInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{template.businessInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <span>{template.businessInfo.website}</span>
                    </div>
                  </div>
                </div>

                {/* Receipt Info */}
                <div className="text-right">
                  <div className="inline-block bg-indigo-50 rounded-lg px-4 py-2">
                    <h2 className="text-lg font-semibold text-indigo-700">RECEIPT</h2>
                    <p className="text-sm text-indigo-600">#{receipt.id.slice(0, 8)}</p>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Date: {new Date(receipt.createdAt).toLocaleDateString()}</p>
                    <p>Due Date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info Section */}
            <div className="py-8 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h2>
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-900">{order.clientName}</p>
                    <p className="whitespace-pre-line mt-2">{order.installationAddress}</p>
                    <p className="mt-2">{order.phone}</p>
                    <p>{order.email}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
                  <div className="text-gray-600">
                    <p><span className="font-medium">Order ID:</span> {order.id.slice(0, 8)}</p>
                    <p><span className="font-medium">Project Name:</span> {order.projectName}</p>
                    <p><span className="font-medium">Payment Status:</span> {receipt.status.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-8">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 font-medium">Payment ({receipt.paymentPercentage}% of total order)</p>
                      <p className="text-sm text-gray-600 mt-1">Project: {order.projectName}</p>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900 font-medium">
                      ${receipt.amount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td className="py-4 px-4 text-right font-medium text-gray-900">Total Amount</td>
                    <td className="py-4 px-4 text-right text-lg font-bold text-indigo-600">
                      ${receipt.amount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                  <p className="whitespace-pre-line">{template.footer.termsAndConditions}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center italic">
                  <p className="whitespace-pre-line">{template.footer.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}