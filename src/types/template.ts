export interface CompanyInfo {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface LayoutSettings {
  primaryColor: string;
  fontFamily: string;
  showLogo: boolean;
  showCompanyInfo: boolean;
  showClientInfo: boolean;
  showProjectDetails: boolean;
  showValidityPeriod: boolean;
  showTaxDetails: boolean;
  showFooterNotes: boolean;
  showContactButtons: boolean;
}

export interface Column {
  key: string;
  label: string;
  enabled: boolean;
}

export interface Section {
  enabled: boolean;
  order: number;
}

export interface ClientInfoSection extends Section {
  title: string;
}

export interface QuoteDetailsSection extends Section {
  title: string;
  columns: Column[];
}

export interface TotalsSection extends Section {
  showSubtotal: boolean;
  showTax: boolean;
  showTotal: boolean;
}

export interface FooterSection extends Section {
  notes: string;
  terms: string;
}

export interface TemplateSections {
  header: Section;
  clientInfo: ClientInfoSection;
  quoteDetails: QuoteDetailsSection;
  totals: TotalsSection;
  footer: FooterSection;
}

export interface TemplateSettings {
  companyInfo: CompanyInfo;
  layout: LayoutSettings;
  sections: TemplateSections;
}