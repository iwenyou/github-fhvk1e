import React from 'react';

interface Footer {
  termsAndConditions: string;
  notes: string;
}

interface FooterFormProps {
  footer: Footer;
  onChange: (footer: Footer) => void;
}

export function FooterForm({ footer, onChange }: FooterFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Terms & Conditions
        </label>
        <textarea
          value={footer.termsAndConditions}
          onChange={(e) =>
            onChange({ ...footer, termsAndConditions: e.target.value })
          }
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter your terms and conditions..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          value={footer.notes}
          onChange={(e) => onChange({ ...footer, notes: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter any additional notes..."
        />
      </div>
    </div>
  );
}