import React from 'react';
import { Order } from '../../types/order';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderHeaderProps {
  order: Order;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

export function OrderHeader({ order, onStatusChange }: OrderHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <div className="mt-2 text-gray-600 space-y-1">
          <p>Order ID: {order.id.slice(0, 8)}</p>
          <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
          {order.quoteId && <p>Quote ID: {order.quoteId.slice(0, 8)}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={order.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <OrderStatusBadge status={order.status} />
      </div>
    </div>
  );
}