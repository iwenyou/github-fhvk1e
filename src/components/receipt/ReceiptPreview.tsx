import React from 'react';
import { X, Building2, Phone, Mail, Globe } from 'lucide-react';
import { Order, ReceiptTemplate } from '../../types/order';

interface ReceiptPreviewProps {
  order: Order;
  receipt: any;
  template: ReceiptTemplate;
  onClose: () => void;
}

export function ReceiptPreview({ order, receipt, template, onClose }: ReceiptPreviewProps) {
  const formatDimensions = (item: any) => {
    return `${item.height}"H x ${item.width}"W x ${item.depth}"D`;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Receipt Preview</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">
                {template.businessInfo.name}
              </h1>
              <div className="space-y-2 text-white/90">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 opacity-75" />
                  <span className="whitespace-pre-line">{template.businessInfo.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 opacity-75" />
                  <span>{template.businessInfo.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 opacity-75" />
                  <span>{template.businessInfo.email}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 opacity-75" />
                  <span>{template.businessInfo.website}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <h2 className="text-xl font-semibold">RECEIPT</h2>
                <p className="text-sm opacity-90">#{receipt.id.slice(0, 8)}</p>
              </div>
              <div className="mt-4 text-sm text-white/90">
                <p>Date: {new Date(receipt.createdAt).toLocaleDateString()}</p>
                <p>Due Date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="p-8 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Bill To
              </h2>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900 text-lg">{order.clientName}</p>
                <p className="whitespace-pre-line mt-2">{order.installationAddress}</p>
                <p className="mt-2">{order.phone}</p>
                <p>{order.email}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                Project Details
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Project Name:</span>
                  <span className="font-medium text-gray-900">{order.projectName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium text-indigo-600">{receipt.status.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        {template.columns.spaceName && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Space</th>
                    {template.columns.productType && (
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    )}
                    {template.columns.materialName && (
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Material</th>
                    )}
                    {template.columns.dimensions && (
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dimensions</th>
                    )}
                    {template.columns.price && (
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="text-gray-900 font-medium">{item.spaceName}</p>
                      </td>
                      {template.columns.productType && (
                        <td className="py-4 px-4 text-gray-900">{item.productId}</td>
                      )}
                      {template.columns.materialName && (
                        <td className="py-4 px-4 text-gray-900">{item.material}</td>
                      )}
                      {template.columns.dimensions && (
                        <td className="py-4 px-4 text-gray-900">{formatDimensions(item)}</td>
                      )}
                      {template.columns.price && (
                        <td className="py-4 px-4 text-right font-medium text-gray-900">${item.price.toFixed(2)}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={5} className="py-6 px-4">
                      <div className="flex flex-col items-end">
                        <p className="text-sm text-gray-600">Payment ({receipt.paymentPercentage}% of total order)</p>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">
                          ${receipt.amount.toFixed(2)}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-8 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Terms & Conditions
              </h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="whitespace-pre-line text-gray-600 text-sm leading-relaxed">
                  {template.footer.termsAndConditions}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                <p className="text-gray-600 italic text-sm">
                  {template.footer.notes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}