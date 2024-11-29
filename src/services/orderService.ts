import { Order, OrderItem } from '../types/order';
import { QuoteData } from './quoteService';
import { generateReceiptPDF } from './pdfService';

const ORDERS_STORAGE_KEY = 'orders';

export function getAllOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

export function getOrderById(id: string): Order | undefined {
  try {
    const orders = getAllOrders();
    return orders.find(order => order.id === id);
  } catch (error) {
    console.error('Error getting order:', error);
    throw new Error('Failed to get order');
  }
}

export function createOrderFromQuote(quote: QuoteData): Order {
  try {
    const items: OrderItem[] = quote.spaces.flatMap(space =>
      space.items.map(item => ({
        ...item,
        spaceName: space.name
      }))
    );

    const order: Order = {
      id: crypto.randomUUID(),
      quoteId: quote.id!,
      clientName: quote.clientName,
      email: quote.email,
      phone: quote.phone,
      projectName: quote.projectName,
      installationAddress: quote.installationAddress,
      items,
      status: 'pending',
      total: quote.total,
      receipts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const orders = getAllOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order from quote');
  }
}

export function updateOrder(id: string, updates: Partial<Order>): Order {
  try {
    const orders = getAllOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      throw new Error('Order not found');
    }

    const updatedOrder = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    orders[index] = updatedOrder;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

    return updatedOrder;
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
}

export function deleteOrder(id: string): void {
  try {
    const orders = getAllOrders().filter(order => order.id !== id);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }
}

export function generateReceipt(orderId: string, paymentPercentage: number): Order {
  try {
    const order = getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const totalAmount = order.adjustedTotal || order.total;
    const receiptAmount = (totalAmount * paymentPercentage) / 100;

    const receipt = {
      id: crypto.randomUUID(),
      orderId,
      paymentPercentage,
      amount: receiptAmount,
      status: 'draft' as const,
      createdAt: new Date().toISOString()
    };

    const updatedOrder = {
      ...order,
      receipts: [...(order.receipts || []), receipt]
    };

    return updateOrder(orderId, updatedOrder);
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw new Error('Failed to generate receipt');
  }
}

export async function sendReceipt(orderId: string, receiptId: string): Promise<void> {
  try {
    const order = getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const receipt = order.receipts?.find(r => r.id === receiptId);
    if (!receipt) throw new Error('Receipt not found');

    // Simulate sending email with receipt
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedReceipts = (order.receipts || []).map(r =>
      r.id === receiptId
        ? { ...r, status: 'sent' as const, sentAt: new Date().toISOString() }
        : r
    );

    updateOrder(orderId, { receipts: updatedReceipts });
  } catch (error) {
    console.error('Error sending receipt:', error);
    throw new Error('Failed to send receipt');
  }
}

export async function downloadReceipt(orderId: string, receiptId: string): Promise<void> {
  try {
    const order = getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const receipt = order.receipts?.find(r => r.id === receiptId);
    if (!receipt) throw new Error('Receipt not found');

    const pdfBlob = await generateReceiptPDF(order, receipt);
    const url = URL.createObjectURL(pdfBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receipt.id.slice(0, 8)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw new Error('Failed to download receipt');
  }
}

export function deleteReceipt(orderId: string, receiptId: string): Order {
  try {
    const order = getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const updatedReceipts = (order.receipts || []).filter(r => r.id !== receiptId);
    return updateOrder(orderId, { receipts: updatedReceipts });
  } catch (error) {
    console.error('Error deleting receipt:', error);
    throw new Error('Failed to delete receipt');
  }
}