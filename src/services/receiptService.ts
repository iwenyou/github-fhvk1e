import { ReceiptTemplate } from '../types/order';

const RECEIPT_TEMPLATE_STORAGE_KEY = 'receiptTemplate';

const defaultTemplate: ReceiptTemplate = {
  businessInfo: {
    name: 'Your Business Name',
    address: '123 Business Street\nCity, State 12345',
    phone: '(555) 123-4567',
    email: 'contact@business.com',
    website: 'www.business.com'
  },
  columns: {
    spaceName: true,
    productType: true,
    partName: true,
    materialName: true,
    dimensions: true,
    quantity: true,
    price: true,
    total: true
  },
  footer: {
    termsAndConditions: 'Payment is due within 14 days of receipt.\nCustom orders are non-refundable.\nPlease contact us for any questions regarding your order.',
    notes: 'Thank you for your business!'
  },
  adjustments: [
    {
      type: 'discount',
      name: 'Loyalty Discount',
      percentage: 5
    },
    {
      type: 'surcharge',
      name: 'Rush Delivery',
      percentage: 10
    }
  ]
};

export function getReceiptTemplate(): ReceiptTemplate {
  const stored = localStorage.getItem(RECEIPT_TEMPLATE_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(RECEIPT_TEMPLATE_STORAGE_KEY, JSON.stringify(defaultTemplate));
    return defaultTemplate;
  }
  return JSON.parse(stored);
}

export function saveReceiptTemplate(template: ReceiptTemplate): void {
  localStorage.setItem(RECEIPT_TEMPLATE_STORAGE_KEY, JSON.stringify(template));
}

export function generateReceiptHTML(order: Order, template: ReceiptTemplate): string {
  // In a real application, this would generate HTML for the receipt
  // For now, we'll return a placeholder
  return `
    <html>
      <body>
        <h1>Receipt for Order ${order.id}</h1>
        <p>Generated using template</p>
      </body>
    </html>
  `;
}