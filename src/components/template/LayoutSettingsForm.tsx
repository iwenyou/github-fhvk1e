import React from 'react';
import { LayoutSettings } from '../../types/template';

interface LayoutSettingsFormProps {
  layout: LayoutSettings;
  onChange: (layout: LayoutSettings) => void;
}

export function LayoutSettingsForm({ layout, onChange }: LayoutSettingsFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Primary Color
        </label>
        <div className="mt-1 flex items-center space-x-2">
          <input
            type="color"
            value={layout.primaryColor}
            onChange={(e) =>
              onChange({ ...layout, primaryColor: e.target.value })
            }
            className="h-8 w-8 rounded-md border border-gray-300"
          />
          <input
            type="text"
            value={layout.primaryColor}
            onChange={(e) =>
              onChange({ ...layout, primaryColor: e.target.value })
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Font Family
        </label>
        <select
          value={layout.fontFamily}
          onChange={(e) => onChange({ ...layout, fontFamily: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
        </select>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Display Options</h3>
        <div className="space-y-2">
          {Object.entries(layout)
            .filter(([key]) => key.startsWith('show'))
            .map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value as boolean}
                  onChange={(e) =>
                    onChange({ ...layout, [key]: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={key}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {key
                    .replace('show', 'Show ')
                    .replace(/([A-Z])/g, ' $1')
                    .trim()}
                </label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}