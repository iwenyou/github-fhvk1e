import { TemplateSettings } from '../types/template';

const defaultTemplate: TemplateSettings = {
  companyInfo: {
    name: 'ADUOne',
    logo: '',
    address: '123 Business Street\nCity, State 12345',
    phone: '(123) 456-7890',
    email: 'contact@company.com',
    website: 'www.aduone.com'
  },
  layout: {
    primaryColor: '#4F46E5',
    fontFamily: 'Inter',
    showLogo: true,
    showCompanyInfo: true,
    showClientInfo: true,
    showProjectDetails: true,
    showValidityPeriod: true,
    showTaxDetails: true,
    showFooterNotes: true,
    showContactButtons: true
  },
  sections: {
    header: {
      enabled: true,
      order: 1
    },
    clientInfo: {
      enabled: true,
      order: 2,
      title: 'Client Information'
    },
    quoteDetails: {
      enabled: true,
      order: 3,
      title: 'Quote Details',
      columns: [
        { key: 'product', label: 'Product', enabled: true },
        { key: 'material', label: 'Material', enabled: true },
        { key: 'width', label: 'Width', enabled: true },
        { key: 'height', label: 'Height', enabled: true },
        { key: 'depth', label: 'Depth', enabled: true },
        { key: 'price', label: 'Price', enabled: true }
      ]
    },
    totals: {
      enabled: true,
      order: 4,
      showSubtotal: true,
      showTax: true,
      showTotal: true
    },
    footer: {
      enabled: true,
      order: 5,
      notes: 'Thank you for considering ADUOne for your project. Please contact us for further information.',
      terms: 'This quote is valid for 30 days from the date of issue.'
    }
  }
};

export function getTemplateSettings(): TemplateSettings {
  const stored = localStorage.getItem('templateSettings');
  if (!stored) {
    localStorage.setItem('templateSettings', JSON.stringify(defaultTemplate));
    return defaultTemplate;
  }
  return JSON.parse(stored);
}

export function saveTemplateSettings(settings: TemplateSettings): void {
  localStorage.setItem('templateSettings', JSON.stringify(settings));
}