import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Order } from '../types/order';
import { getOrderById, updateOrder } from '../services/orderService';
import { OrderItemsTable } from '../components/orders/OrderItemsTable';
import { OrderTotals } from '../components/orders/OrderTotals';
import { ReceiptManager } from '../components/orders/ReceiptManager';
import { ClientInfo } from '../components/orders/ClientInfo';

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const orderData = getOrderById(id);
      if (orderData) {
        setOrder(orderData);
      } else {
        navigate('/orders');
      }
    }
  }, [id, navigate]);

  if (!order) return null;

  const handleStatusChange = (newStatus: string) => {
    if (order) {
      const updatedOrder = updateOrder(order.id, {
        status: newStatus as Order['status']
      });
      setOrder(updatedOrder);
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <div className="mt-2 text-gray-600 space-y-1">
            <p>Order ID: {order.id.slice(0, 8)}</p>
            <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
            {order.quoteId && <p>Quote ID: {order.quoteId.slice(0, 8)}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => navigate(`/orders/${order.id}/edit`)}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Order
          </button>
          <div>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(order.status)} border-none focus:ring-2 focus:ring-indigo-500`}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Client Information */}
          <ClientInfo order={order} />

          {/* Order Items */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Items
              </h2>
              <OrderItemsTable items={order.items} />
            </div>
          </div>

          {/* Receipts */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <ReceiptManager order={order} onUpdate={setOrder} />
            </div>
          </div>
        </div>

        <div>
          {/* Order Totals */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <OrderTotals
                subtotal={order.total}
                adjustmentType={order.adjustmentType}
                adjustmentPercentage={order.adjustmentPercentage}
                adjustedTotal={order.adjustedTotal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}