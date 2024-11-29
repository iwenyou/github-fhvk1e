import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { TemplateSettings } from '../../types/template';
import { getTemplateSettings, saveTemplateSettings } from '../../services/templateService';
import { CompanyInfoForm } from './CompanyInfoForm';
import { LayoutSettingsForm } from './LayoutSettingsForm';
import { SectionsForm } from './SectionsForm';

export function TemplateForm() {
  const [settings, setSettings] = useState<TemplateSettings>(getTemplateSettings());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    setSettings(getTemplateSettings());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTemplateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'company', label: 'Company Information' },
    { id: 'layout', label: 'Layout Settings' },
    { id: 'sections', label: 'Sections' }
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
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

      <div className="space-y-6">
        {activeTab === 'company' && (
          <CompanyInfoForm
            companyInfo={settings.companyInfo}
            onChange={(companyInfo) =>
              setSettings({ ...settings, companyInfo })
            }
          />
        )}

        {activeTab === 'layout' && (
          <LayoutSettingsForm
            layout={settings.layout}
            onChange={(layout) => setSettings({ ...settings, layout })}
          />
        )}

        {activeTab === 'sections' && (
          <SectionsForm
            sections={settings.sections}
            onChange={(sections) => setSettings({ ...settings, sections })}
          />
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          {saved && (
            <span className="text-green-600 font-medium">
              Template saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </button>
        </div>
      </div>
    </form>
  );
}