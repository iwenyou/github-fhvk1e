import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, Download, ExternalLink, ShoppingBag } from 'lucide-react';
import { QuoteFilters } from '../components/quotes/QuoteFilters';
import { getAllQuotes, deleteQuote, updateQuote, QuoteData } from '../services/quoteService';
import { createOrderFromQuote } from '../services/orderService';

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
];

export function Quotes() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setQuotes(getAllQuotes());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      deleteQuote(id);
      setQuotes(getAllQuotes());
    }
  };

  const handleClientView = (id: string) => {
    window.open(`/client/quote/${id}`, '_blank');
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const quote = quotes.find(q => q.id === id);
    if (quote) {
      const updatedQuote = {
        ...quote,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      updateQuote(id, updatedQuote);
      setQuotes(getAllQuotes());
    }
  };

  const handleCreateOrder = (quote: QuoteData) => {
    if (quote.status !== 'approved') {
      alert('Only approved quotes can be converted to orders.');
      return;
    }

    try {
      const order = createOrderFromQuote(quote);
      navigate(`/orders/${order.id}`);
    } catch (error) {
      alert('Failed to create order. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          <p className="mt-2 text-gray-600">
            View and manage all your quotes
          </p>
        </div>
      </div>

      <QuoteFilters />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {quote.id?.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quote.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quote.projectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(quote.total || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote.id!, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(quote.status)} border-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => navigate(`/quotes/${quote.id}/view`)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/quotes/${quote.id}/edit`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleClientView(quote.id!)}
                        className="text-green-600 hover:text-green-900"
                        title="Client View"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCreateOrder(quote)}
                        className={`${
                          quote.status === 'approved'
                            ? 'text-purple-600 hover:text-purple-900'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={quote.status !== 'approved'}
                        title={
                          quote.status === 'approved'
                            ? 'Create Order'
                            : 'Quote must be approved to create order'
                        }
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Download PDF */}}
                        className="text-gray-600 hover:text-gray-900"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id!)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No quotes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}