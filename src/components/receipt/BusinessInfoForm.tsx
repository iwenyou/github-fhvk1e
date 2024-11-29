import React from 'react';

interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

interface BusinessInfoFormProps {
  businessInfo: BusinessInfo;
  onChange: (info: BusinessInfo) => void;
}

export function BusinessInfoForm({ businessInfo, onChange }: BusinessInfoFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Name
        </label>
        <input
          type="text"
          value={businessInfo.name}
          onChange={(e) => onChange({ ...businessInfo, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          value={businessInfo.address}
          onChange={(e) => onChange({ ...businessInfo, address: e.target.value })}
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
          value={businessInfo.phone}
          onChange={(e) => onChange({ ...businessInfo, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={businessInfo.email}
          onChange={(e) => onChange({ ...businessInfo, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="url"
          value={businessInfo.website}
          onChange={(e) => onChange({ ...businessInfo, website: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}