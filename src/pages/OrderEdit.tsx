import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Order } from '../types/order';
import { getOrderById, updateOrder } from '../services/orderService';
import { OrderHeader } from '../components/orders/OrderHeader';
import { OrderItemsTable } from '../components/orders/OrderItemsTable';
import { OrderTotals } from '../components/orders/OrderTotals';
import { OrderAdjustmentForm } from '../components/orders/OrderAdjustmentForm';

export function OrderEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'discount' | 'surcharge'>('discount');
  const [adjustmentPercentage, setAdjustmentPercentage] = useState(0);

  useEffect(() => {
    if (id) {
      const orderData = getOrderById(id);
      if (orderData) {
        setOrder(orderData);
        setAdjustmentType(orderData.adjustmentType || 'discount');
        setAdjustmentPercentage(orderData.adjustmentPercentage || 0);
      } else {
        navigate('/orders');
      }
    }
  }, [id, navigate]);

  if (!order) return null;

  const handleStatusChange = (newStatus: string) => {
    try {
      const updatedOrder = updateOrder(order.id, {
        status: newStatus as Order['status']
      });
      setOrder(updatedOrder);
    } catch (error) {
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleClientInfoChange = (field: keyof Order, value: string) => {
    setOrder(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleAdjustment = () => {
    if (!order) return;

    const multiplier = adjustmentType === 'discount' 
      ? (100 - adjustmentPercentage) / 100 
      : (100 + adjustmentPercentage) / 100;
    const adjustedTotal = order.total * multiplier;

    try {
      const updatedOrder = updateOrder(order.id, {
        adjustmentType,
        adjustmentPercentage,
        adjustedTotal
      });
      setOrder(updatedOrder);
    } catch (error) {
      alert('Failed to apply adjustment. Please try again.');
    }
  };

  const handleSave = () => {
    try {
      const updatedOrder = updateOrder(order.id, order);
      navigate(`/orders/${order.id}`);
    } catch (error) {
      alert('Failed to save changes. Please try again.');
    }
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

      <OrderHeader order={order} onStatusChange={handleStatusChange} />

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
                    value={order.clientName}
                    onChange={(e) => handleClientInfoChange('clientName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={order.email}
                    onChange={(e) => handleClientInfoChange('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={order.phone}
                    onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={order.installationAddress}
                    onChange={(e) => handleClientInfoChange('installationAddress', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Items
              </h2>
              <OrderItemsTable items={order.items} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Price Adjustment */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Price Adjustment
              </h2>
              <OrderAdjustmentForm
                type={adjustmentType}
                percentage={adjustmentPercentage}
                onTypeChange={setAdjustmentType}
                onPercentageChange={setAdjustmentPercentage}
                onApply={handleAdjustment}
              />
            </div>
          </div>

          {/* Order Summary */}
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

          {/* Save Changes */}
          <button
            onClick={handleSave}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}