import React, { useState, useEffect } from 'react';
import { Eye, Save } from 'lucide-react';
import { ReceiptTemplate as ReceiptTemplateType } from '../types/order';
import { getReceiptTemplate, saveReceiptTemplate } from '../services/receiptService';
import { BusinessInfoForm } from '../components/receipt/BusinessInfoForm';
import { ColumnsForm } from '../components/receipt/ColumnsForm';
import { FooterForm } from '../components/receipt/FooterForm';
import { AdjustmentsForm } from '../components/receipt/AdjustmentsForm';
import { ReceiptPreview } from '../components/receipt/ReceiptPreview';

const demoOrder = {
  id: 'DEMO-ORDER',
  clientName: 'John Smith',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
  projectName: 'Kitchen Renovation',
  installationAddress: '123 Main Street\nAnytown, ST 12345',
  items: [
    {
      id: '1',
      spaceName: 'Kitchen',
      productId: 'Base Cabinet',
      material: 'Solid Wood',
      width: 30,
      height: 36,
      depth: 24,
      price: 599.99
    },
    {
      id: '2',
      spaceName: 'Kitchen',
      productId: 'Wall Cabinet',
      material: 'Solid Wood',
      width: 30,
      height: 30,
      depth: 12,
      price: 399.99
    }
  ],
  status: 'pending',
  total: 999.98,
  createdAt: new Date().toISOString()
};

const demoReceipt = {
  id: 'DEMO-RECEIPT',
  orderId: 'DEMO-ORDER',
  paymentPercentage: 50,
  amount: 499.99,
  status: 'draft',
  createdAt: new Date().toISOString()
};

export function ReceiptTemplate() {
  const [template, setTemplate] = useState<ReceiptTemplateType>(getReceiptTemplate());
  const [activeTab, setActiveTab] = useState('business');
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setTemplate(getReceiptTemplate());
  }, []);

  const handleSave = () => {
    saveReceiptTemplate(template);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'business', label: 'Business Information' },
    { id: 'columns', label: 'Columns' },
    { id: 'footer', label: 'Footer' },
    { id: 'adjustments', label: 'Adjustments' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receipt Template</h1>
          <p className="mt-2 text-gray-600">
            Customize how your receipts look and what information they include
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Receipt
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'business' && (
            <BusinessInfoForm
              businessInfo={template.businessInfo}
              onChange={(businessInfo) =>
                setTemplate({ ...template, businessInfo })
              }
            />
          )}

          {activeTab === 'columns' && (
            <ColumnsForm
              columns={template.columns}
              onChange={(columns) => setTemplate({ ...template, columns })}
            />
          )}

          {activeTab === 'footer' && (
            <FooterForm
              footer={template.footer}
              onChange={(footer) => setTemplate({ ...template, footer })}
            />
          )}

          {activeTab === 'adjustments' && (
            <AdjustmentsForm
              adjustments={template.adjustments}
              onChange={(adjustments) => setTemplate({ ...template, adjustments })}
            />
          )}

          {saved && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">
                Template saved successfully!
              </p>
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowPreview(false)} />
            <div className="relative bg-white rounded-lg max-w-4xl w-full">
              <ReceiptPreview
                order={demoOrder}
                receipt={demoReceipt}
                template={template}
                onClose={() => setShowPreview(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}