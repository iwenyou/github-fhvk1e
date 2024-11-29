import { Order } from '../types/order';
import { getReceiptTemplate } from './receiptService';

export async function generateReceiptPDF(order: Order, receipt: any): Promise<Blob> {
  // This is a mock implementation
  // In a real application, you would use a PDF generation library like pdfmake or jsPDF
  
  const template = getReceiptTemplate();
  
  // Create a simple HTML structure for the receipt
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt ${receipt.id}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .receipt { max-width: 800px; margin: 0 auto; padding: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .company-info { margin-bottom: 20px; }
          .receipt-info { text-align: right; }
          .client-info { margin-bottom: 40px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          .items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
          .total { text-align: right; margin-top: 20px; }
          .footer { margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <!-- Company Info -->
          <div class="header">
            <div class="company-info">
              <h1>${template.businessInfo.name}</h1>
              <p>${template.businessInfo.address}</p>
              <p>${template.businessInfo.phone}</p>
              <p>${template.businessInfo.email}</p>
            </div>
            <div class="receipt-info">
              <h2>RECEIPT #${receipt.id.slice(0, 8)}</h2>
              <p>Date: ${new Date(receipt.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <!-- Client Info -->
          <div class="client-info">
            <h3>Bill To:</h3>
            <p>${order.clientName}</p>
            <p>${order.installationAddress}</p>
            <p>${order.phone}</p>
            <p>${order.email}</p>
          </div>

          <!-- Payment Details -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Payment (${receipt.paymentPercentage}% of total order)</td>
                <td>$${receipt.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            <h3>Total Amount: $${receipt.amount.toFixed(2)}</h3>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>${template.footer.termsAndConditions}</p>
            <p>${template.footer.notes}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Convert HTML to PDF (mock implementation)
  const blob = new Blob([html], { type: 'application/pdf' });
  return blob;
}