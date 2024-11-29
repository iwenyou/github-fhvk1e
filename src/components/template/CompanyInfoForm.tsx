import React from 'react';
import { CompanyInfo } from '../../types/template';

interface CompanyInfoFormProps {
  companyInfo: CompanyInfo;
  onChange: (info: CompanyInfo) => void;
}

export function CompanyInfoForm({ companyInfo, onChange }: CompanyInfoFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          type="text"
          value={companyInfo.name}
          onChange={(e) => onChange({ ...companyInfo, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="url"
          value={companyInfo.logo}
          onChange={(e) => onChange({ ...companyInfo, logo: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          value={companyInfo.address}
          onChange={(e) => onChange({ ...companyInfo, address: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          value={companyInfo.phone}
          onChange={(e) => onChange({ ...companyInfo, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={companyInfo.email}
          onChange={(e) => onChange({ ...companyInfo, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="url"
          value={companyInfo.website}
          onChange={(e) => onChange({ ...companyInfo, website: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}