import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Mail, Building2, Phone, Globe, CheckCircle2 } from 'lucide-react';
import { QuoteData } from '../services/quoteService';
import { getQuoteById } from '../services/quoteService';
import { getDemoQuote } from '../services/demoService';
import { getProducts, getMaterials } from '../services/catalogService';
import { getTemplateSettings } from '../services/templateService';
import { getPresetValues } from '../services/presetService';
import { Product, Material } from '../types/catalog';
import { TemplateSettings } from '../types/template';

const commitments = [
  {
    title: "Quality Assurance",
    description: "We guarantee the highest quality materials and craftsmanship in every project."
  },
  {
    title: "Expert Installation",
    description: "Our certified professionals ensure precise and efficient installation."
  },
  {
    title: "Timely Delivery",
    description: "We commit to meeting agreed-upon timelines and keeping you informed."
  },
  {
    title: "Customer Satisfaction",
    description: "Your complete satisfaction is our top priority."
  }
];

export function ClientQuoteView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [template, setTemplate] = useState<TemplateSettings>(getTemplateSettings());
  const [taxRate, setTaxRate] = useState(0);
  const styles = {
    fontFamily: template.layout.fontFamily,
    primaryColor: template.layout.primaryColor,
  };

  useEffect(() => {
    setProducts(getProducts());
    setMaterials(getMaterials());
    setTemplate(getTemplateSettings());
    const presetValues = getPresetValues();
    setTaxRate(presetValues.taxRate / 100); // Convert percentage to decimal

    if (id === 'demo') {
      setQuote(getDemoQuote());
    } else if (id) {
      const quoteData = getQuoteById(id);
      if (quoteData) {
        setQuote(quoteData);
      } else {
        navigate('/404');
      }
    }
  }, [id, navigate]);

  if (!quote) return null;

  const getProductName = (productId?: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Custom Product';
  };

  const getMaterialName = (materialId?: string) => {
    const material = materials.find(m => m.id === materialId);
    return material?.name || 'Default';
  };

  const formatDimensions = (item: any) => {
    return `${item.height}"H x ${item.width}"W x ${item.depth}"D`;
  };

  const calculateSubtotal = () => {
    return quote.spaces.reduce((sum, space) => 
      sum + space.items.reduce((itemSum, item) => itemSum + item.price, 0), 
      0
    );
  };

  const subtotal = calculateSubtotal();
  const discountRate = quote.adjustmentType === 'discount' ? quote.adjustmentPercentage || 0 : 0;
  const discountAmount = (subtotal * discountRate) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" style={{ fontFamily: styles.fontFamily }}>
      {template.sections.header.enabled && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-12">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold mb-4">
                    {template.companyInfo.name}
                  </h1>
                  <div className="space-y-2 text-white/90">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 opacity-75" />
                      <span className="whitespace-pre-line">{template.companyInfo.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 opacity-75" />
                      <span>{template.companyInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 opacity-75" />
                      <span>{template.companyInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 opacity-75" />
                      <span>{template.companyInfo.website}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                    <h2 className="text-2xl font-semibold">QUOTE</h2>
                    <p className="text-sm opacity-90">#{quote.id?.slice(0, 8)}</p>
                  </div>
                  <div className="mt-4 text-sm text-white/90">
                    <p>Date: {new Date(quote.createdAt).toLocaleDateString()}</p>
                    <p>Valid Until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto mt-8 space-y-8">
        {template.sections.clientInfo.enabled && (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                    Client Information
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium text-gray-900">Name:</span> {quote.clientName}</p>
                    <p><span className="font-medium text-gray-900">Email:</span> {quote.email}</p>
                    <p><span className="font-medium text-gray-900">Phone:</span> {quote.phone}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Project Details
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium text-gray-900">Project Name:</span> {quote.projectName}</p>
                    <p><span className="font-medium text-gray-900">Installation Address:</span></p>
                    <p className="whitespace-pre-line pl-4 border-l-2 border-gray-200">{quote.installationAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {template.sections.quoteDetails.enabled && quote.spaces.map((space) => (
          <div key={space.id} className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{space.name}</h3>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {space.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 text-sm text-gray-900 font-medium">
                          {getProductName(item.productId)}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          {getMaterialName(item.material)}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          {formatDimensions(item)}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900 text-right font-medium">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {template.sections.totals.enabled && (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-end">
                <div className="w-80">
                  <dl className="space-y-4">
                    {template.sections.totals.showSubtotal && (
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Subtotal</dt>
                        <dd className="text-gray-900 font-medium">${subtotal.toFixed(2)}</dd>
                      </div>
                    )}
                    {discountRate > 0 && (
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Discount ({discountRate}%)</dt>
                        <dd className="text-green-600 font-medium">-${discountAmount.toFixed(2)}</dd>
                      </div>
                    )}
                    {discountRate > 0 && (
                      <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                        <dt className="text-gray-500">Subtotal after discount</dt>
                        <dd className="text-gray-900 font-medium">${subtotalAfterDiscount.toFixed(2)}</dd>
                      </div>
                    )}
                    {template.sections.totals.showTax && (
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Tax ({(taxRate * 100).toFixed(1)}%)</dt>
                        <dd className="text-gray-900 font-medium">${tax.toFixed(2)}</dd>
                      </div>
                    )}
                    {template.sections.totals.showTotal && (
                      <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                        <dt className="text-lg font-semibold text-gray-900">Total</dt>
                        <dd className="text-2xl font-bold" style={{ color: styles.primaryColor }}>
                          ${total.toFixed(2)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Our Commitments to You</h2>
            <div className="grid grid-cols-2 gap-6">
              {commitments.map((commitment, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">{commitment.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{commitment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {template.sections.footer.enabled && (
          <div className="space-y-6 text-center">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8">
              <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto">
                {template.sections.footer.notes}
              </p>
              <div className="mt-6 text-sm text-gray-500">
                {template.sections.footer.terms}
              </div>
            </div>
          </div>
        )}

        {template.layout.showContactButtons && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            <a
              href={`mailto:${template.companyInfo.email}`}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </a>
          </div>
        )}
      </div>
    </div>
  );
}