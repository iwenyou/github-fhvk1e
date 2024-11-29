import React from 'react';
import { Eye } from 'lucide-react';
import { TemplateForm } from '../components/template/TemplateForm';
import { TemplatePreview } from '../components/template/TemplatePreview';

export function QuoteTemplate() {
  const handlePreview = () => {
    window.open('/client/quote/demo', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quote Template</h1>
          <p className="mt-2 text-gray-600">
            Customize your quote template and branding
          </p>
        </div>
        <button
          onClick={handlePreview}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TemplateForm />
        <TemplatePreview />
      </div>
    </div>
  );
}