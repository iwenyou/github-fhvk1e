import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Space, CabinetItem } from '../types/quote';
import { getQuoteById, updateQuote, QuoteData } from '../services/quoteService';
import { SpaceSection } from '../components/quote/SpaceSection';

const defaultItem: Omit<CabinetItem, 'id'> = {
  width: 30,
  height: 30,
  depth: 24,
  price: 299.99,
};

export function QuoteEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'discount' | 'surcharge'>('discount');
  const [adjustmentPercentage, setAdjustmentPercentage] = useState(0);

  useEffect(() => {
    if (id) {
      const quoteData = getQuoteById(id);
      if (quoteData) {
        setQuote(quoteData);
        setAdjustmentType(quoteData.adjustmentType || 'discount');
        setAdjustmentPercentage(quoteData.adjustmentPercentage || 0);
      } else {
        navigate('/quotes');
      }
    }
  }, [id, navigate]);

  if (!quote) return null;

  const handleAddSpace = () => {
    const newSpace: Space = {
      id: crypto.randomUUID(),
      name: `Space #${quote.spaces.length + 1}`,
      items: [],
    };
    setQuote(prev => ({
      ...prev!,
      spaces: [...prev!.spaces, newSpace],
    }));
  };

  const handleUpdateSpace = (spaceId: string, updates: Partial<Space>) => {
    setQuote(prev => ({
      ...prev!,
      spaces: prev!.spaces.map(space =>
        space.id === spaceId ? { ...space, ...updates } : space
      ),
    }));
  };

  const handleDeleteSpace = (spaceId: string) => {
    setQuote(prev => ({
      ...prev!,
      spaces: prev!.spaces.filter(space => space.id !== spaceId),
    }));
  };

  const handleAddItem = (spaceId: string) => {
    const newItem: CabinetItem = {
      id: crypto.randomUUID(),
      ...defaultItem,
    };
    setQuote(prev => ({
      ...prev!,
      spaces: prev!.spaces.map(space =>
        space.id === spaceId
          ? { ...space, items: [...space.items, newItem] }
          : space
      ),
    }));
  };

  const handleUpdateItem = (spaceId: string, itemId: string, updates: Partial<CabinetItem>) => {
    setQuote(prev => ({
      ...prev!,
      spaces: prev!.spaces.map(space =>
        space.id === spaceId
          ? {
              ...space,
              items: space.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : space
      ),
    }));
  };

  const handleDeleteItem = (spaceId: string, itemId: string) => {
    setQuote(prev => ({
      ...prev!,
      spaces: prev!.spaces.map(space =>
        space.id === spaceId
          ? { ...space, items: space.items.filter(item => item.id !== itemId) }
          : space
      ),
    }));
  };

  const handleClientInfoChange = (field: keyof QuoteData, value: string) => {
    setQuote(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleAdjustment = () => {
    const subtotal = calculateSubtotal();
    const multiplier = adjustmentType === 'discount' 
      ? (100 - adjustmentPercentage) / 100 
      : (100 + adjustmentPercentage) / 100;
    const adjustedSubtotal = subtotal * multiplier;
    const tax = adjustedSubtotal * 0.13; // Tax rate should come from preset values
    const total = adjustedSubtotal + tax;

    setQuote(prev => ({
      ...prev!,
      adjustmentType,
      adjustmentPercentage,
      adjustedTotal: adjustedSubtotal,
      total
    }));
  };

  const calculateSubtotal = () => {
    return quote.spaces.reduce(
      (sum, space) =>
        sum +
        space.items.reduce((itemSum, item) => itemSum + item.price, 0),
      0
    );
  };

  const handleSave = () => {
    try {
      if (quote.id) {
        updateQuote(quote.id, quote);
        navigate(`/quotes/${quote.id}/view`);
      }
    } catch (error) {
      alert('Failed to save changes. Please try again.');
    }
  };

  const subtotal = calculateSubtotal();
  const adjustedSubtotal = quote.adjustedTotal || subtotal;
  const tax = adjustedSubtotal * 0.13; // Tax rate should come from preset values
  const total = adjustedSubtotal + tax;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/quotes')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quotes
        </button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Quote</h1>
          <p className="mt-2 text-gray-600">
            Quote ID: {quote.id?.slice(0, 8)}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Client Information */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Client Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={quote.clientName}
                    onChange={(e) => handleClientInfoChange('clientName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={quote.email}
                    onChange={(e) => handleClientInfoChange('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={quote.phone}
                    onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    value={quote.projectName}
                    onChange={(e) => handleClientInfoChange('projectName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Installation Address</label>
                  <textarea
                    value={quote.installationAddress}
                    onChange={(e) => handleClientInfoChange('installationAddress', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Spaces */}
          <div className="space-y-6">
            {quote.spaces.map((space) => (
              <SpaceSection
                key={space.id}
                space={space}
                onUpdateSpace={handleUpdateSpace}
                onDeleteSpace={handleDeleteSpace}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
              />
            ))}

            <button
              onClick={handleAddSpace}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900"
            >
              Add Space
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Price Adjustment */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Price Adjustment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value as 'discount' | 'surcharge')}
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
                      value={adjustmentPercentage}
                      onChange={(e) => setAdjustmentPercentage(Number(e.target.value))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>

                <button
                  onClick={handleAdjustment}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Apply Adjustment
                </button>
              </div>
            </div>
          </div>

          {/* Quote Summary */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Quote Summary
              </h2>
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
                  <dt className="text-gray-500">Tax (13%)</dt>
                  <dd className="text-gray-900">${tax.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
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