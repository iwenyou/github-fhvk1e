import React, { useState } from 'react';
import { Mail, Download, Plus, Trash2, Eye, Link } from 'lucide-react';
import { Order } from '../../types/order';
import { generateReceipt, sendReceipt, deleteReceipt, downloadReceipt } from '../../services/orderService';
import { ReceiptPreview } from './ReceiptPreview';

interface ReceiptManagerProps {
  order: Order;
  onUpdate: (updatedOrder: Order) => void;
}

export function ReceiptManager({ order, onUpdate }: ReceiptManagerProps) {
  const [newPercentage, setNewPercentage] = useState(100);
  const [loading, setLoading] = useState(false);
  const [previewReceiptId, setPreviewReceiptId] = useState<string | null>(null);
  const [sendingReceiptId, setSendingReceiptId] = useState<string | null>(null);

  const totalReceiptPercentage = order.receipts?.reduce(
    (sum, receipt) => sum + receipt.paymentPercentage,
    0
  ) || 0;

  const remainingPercentage = 100 - totalReceiptPercentage;

  const handleGenerateReceipt = () => {
    if (newPercentage > remainingPercentage) {
      alert(`Cannot exceed remaining percentage of ${remainingPercentage}%`);
      return;
    }

    const updatedOrder = generateReceipt(order.id, newPercentage);
    onUpdate(updatedOrder);
    setNewPercentage(remainingPercentage > 0 ? remainingPercentage : 0);
  };

  const handleSendReceipt = async (receiptId: string) => {
    if (!order.email?.trim()) {
      alert('Cannot send receipt: Client email address is missing');
      return;
    }

    setSendingReceiptId(receiptId);
    setLoading(true);
    try {
      await sendReceipt(order.id, receiptId);
      alert('Receipt sent successfully!');
    } catch (error) {
      alert('Failed to send receipt. Please try again.');
    } finally {
      setLoading(false);
      setSendingReceiptId(null);
    }
  };

  const handleDownloadReceipt = async (receiptId: string) => {
    try {
      await downloadReceipt(order.id, receiptId);
    } catch (error) {
      alert('Failed to download receipt. Please try again.');
    }
  };

  const handleDeleteReceipt = (receiptId: string) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      const updatedOrder = deleteReceipt(order.id, receiptId);
      onUpdate(updatedOrder);
    }
  };

  const handleCopyReceiptLink = (receiptId: string) => {
    const url = `${window.location.origin}/client/receipt/${order.id}/${receiptId}`;
    navigator.clipboard.writeText(url);
    alert('Receipt link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Receipts</h3>
        {remainingPercentage > 0 && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max={remainingPercentage}
                value={newPercentage}
                onChange={(e) => setNewPercentage(Number(e.target.value))}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <span className="ml-2">%</span>
            </div>
            <button
              onClick={handleGenerateReceipt}
              disabled={newPercentage > remainingPercentage}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white ${
                newPercentage > remainingPercentage
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Generate Receipt
            </button>
          </div>
        )}
      </div>

      {order.receipts && order.receipts.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.receipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(receipt.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {receipt.paymentPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${receipt.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        receipt.status === 'sent'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setPreviewReceiptId(receipt.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendReceipt(receipt.id)}
                        disabled={loading && sendingReceiptId === receipt.id}
                        className={`text-gray-600 hover:text-gray-900 ${
                          loading && sendingReceiptId === receipt.id ? 'opacity-50 cursor-wait' : ''
                        }`}
                        title={!order.email ? 'Client email is missing' : 'Send Receipt'}
                      >
                        <Mail className={`h-4 w-4 ${sendingReceiptId === receipt.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleCopyReceiptLink(receipt.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Copy Receipt Link"
                      >
                        <Link className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadReceipt(receipt.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Download Receipt"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {receipt.status === 'draft' && (
                        <button
                          onClick={() => handleDeleteReceipt(receipt.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Receipt"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No receipts generated yet</p>
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-500">
        <span>Total Receipt Coverage:</span>
        <span>{totalReceiptPercentage}%</span>
      </div>

      {previewReceiptId && (
        <ReceiptPreview
          order={order}
          receiptId={previewReceiptId}
          onClose={() => setPreviewReceiptId(null)}
        />
      )}
    </div>
  );
}