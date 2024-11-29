import { QuoteData } from './quoteService';

export function getDemoQuote(): QuoteData {
  return {
    id: 'DEMO-2024-001',
    clientName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    projectName: 'Kitchen Renovation',
    installationAddress: '123 Demo Street\nAnytown, ST 12345',
    spaces: [
      {
        id: '1',
        name: 'Kitchen',
        items: [
          {
            id: '1',
            productId: '1',
            material: '1',
            width: 30,
            height: 36,
            depth: 24,
            price: 599.99
          },
          {
            id: '2',
            productId: '1',
            material: '1',
            width: 24,
            height: 30,
            depth: 24,
            price: 499.99
          }
        ]
      },
      {
        id: '2',
        name: 'Pantry',
        items: [
          {
            id: '3',
            productId: '1',
            material: '1',
            width: 24,
            height: 84,
            depth: 24,
            price: 899.99
          }
        ]
      }
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    total: 1999.97
  };
}