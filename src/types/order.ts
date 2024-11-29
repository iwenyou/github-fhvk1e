interface Receipt {
  id: string;
  orderId: string;
  paymentPercentage: number;
  amount: number;
  status: 'draft' | 'sent';
  createdAt: string;
  sentAt?: string;
}

export interface OrderItem extends CabinetItem {
  spaceName: string;
}

export interface Order {
  id: string;
  quoteId: string;
  clientName: string;
  email: string;
  phone: string;
  projectName: string;
  installationAddress: string;
  items: OrderItem[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total: number;
  adjustmentType?: 'discount' | 'surcharge';
  adjustmentPercentage?: number;
  adjustedTotal?: number;
  receipts: Receipt[];
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptTemplate {
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  columns: {
    spaceName: boolean;
    productType: boolean;
    partName: boolean;
    materialName: boolean;
    dimensions: boolean;
    quantity: boolean;
    price: boolean;
    total: boolean;
  };
  footer: {
    termsAndConditions: string;
    notes: string;
  };
  adjustments: {
    type: 'discount' | 'surcharge';
    name: string;
    percentage: number;
  }[];
}