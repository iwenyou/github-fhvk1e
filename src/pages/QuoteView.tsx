import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Download, Eye } from 'lucide-react';
import { QuoteData } from '../services/quoteService';
import { getQuoteById } from '../services/quoteService';
import { getProducts, getMaterials } from '../services/catalogService';
import { getPresetValues } from '../services/presetService';
import { Product, Material } from '../types/catalog';

export function QuoteView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [taxRate, setTaxRate] = useState(0);

  useEffect(() => {
    if (id) {
      const quoteData = getQuoteById(id);
      if (quoteData) {
        setQuote(quoteData);
      } else {
        navigate('/quotes');
      }
      setProducts(getProducts());
      setMaterials(getMaterials());
      const presetValues = getPresetValues();
      setTaxRate(presetValues.taxRate / 100); // Convert percentage to decimal
    }
  }, [id, navigate]);

  if (!quote) return null;

  const getProductName = (productId?: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Custom Product';
  };

  const getMaterialName = (materialId?: string) => {
    const material = materials.find(m => m.id === materialId);
    return material?.name || 'Default';
  };

  const formatDimensions = (item: any) => {
    return `${item.height}"H x ${item.width}"W x ${item.depth}"D`;
  };

  const calculateSubtotal = () => {
    return quote.spaces.reduce((sum, space) => 
      sum + space.items.reduce((itemSum, item) => itemSum + item.price, 0), 
      0
    );
  };

  const subtotal = calculateSubtotal();
  const adjustedSubtotal = quote.adjustedTotal || subtotal;
  const tax = adjustedSubtotal * taxRate;
  const total = adjustedSubtotal + tax;

  const handlePreview = () => {
    window.open(`/client/quote/${id}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quote Details</h1>
          <p className="mt-2 text-gray-600">
            View quote information and details
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Client View
          </button>
          <button
            onClick={() => navigate(`/quotes/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Quote
          </button>
          <button
            onClick={() => {/* Download PDF */}}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Client Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Client Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.clientName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.phone}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Project Details</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Project Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.projectName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Installation Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                    {quote.installationAddress}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {quote.spaces.map((space) => (
          <div key={space.id} className="border-b border-gray-200">
            <div className="p-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">{space.name}</h3>
            </div>
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensions</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {space.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {getProductName(item.productId)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {getMaterialName(item.material)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {formatDimensions(item)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="p-6">
          <div className="flex justify-end">
            <div className="w-64">
              <dl className="space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="text-gray-900">${subtotal.toFixed(2)}</dd>
                </div>
                {quote.adjustmentType && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">
                      {quote.adjustmentType === 'discount' ? 'Discount' : 'Surcharge'}{' '}
                      ({quote.adjustmentPercentage}%)
                    </dt>
                    <dd className="text-gray-900">
                      {quote.adjustmentType === 'discount' ? '-' : '+'}$
                      {Math.abs(subtotal - adjustedSubtotal).toFixed(2)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Tax ({(taxRate * 100).toFixed(1)}%)</dt>
                  <dd className="text-gray-900">${tax.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-indigo-600">
                    ${total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}