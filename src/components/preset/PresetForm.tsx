import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { NumericInput } from './NumericInput';
import { PricingCalculation } from './PricingCalculation';
import { PresetValues } from '../../types/preset';
import { getPresetValues, savePresetValues } from '../../services/presetService';

export function PresetForm() {
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<PresetValues>(getPresetValues());

  useEffect(() => {
    setValues(getPresetValues());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePresetValues(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleValueChange = (name: keyof PresetValues, value: number) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Default Dimensions
            </h2>
            <NumericInput
              label="Default Height (inches)"
              name="defaultHeight"
              value={values.defaultHeight}
              onChange={(value) => handleValueChange('defaultHeight', value)}
              min={0}
              step={0.1}
            />
            <NumericInput
              label="Default Width (inches)"
              name="defaultWidth"
              value={values.defaultWidth}
              onChange={(value) => handleValueChange('defaultWidth', value)}
              min={0}
              step={0.1}
            />
            <NumericInput
              label="Default Depth (inches)"
              name="defaultDepth"
              value={values.defaultDepth}
              onChange={(value) => handleValueChange('defaultDepth', value)}
              min={0}
              step={0.1}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Pricing Factors
            </h2>
            <NumericInput
              label="Labor Rate ($/hour)"
              name="laborRate"
              value={values.laborRate}
              onChange={(value) => handleValueChange('laborRate', value)}
              min={0}
              step={1}
            />
            <NumericInput
              label="Material Markup (%)"
              name="materialMarkup"
              value={values.materialMarkup}
              onChange={(value) => handleValueChange('materialMarkup', value)}
              min={0}
              max={100}
              step={1}
            />
            <NumericInput
              label="Tax Rate (%)"
              name="taxRate"
              value={values.taxRate}
              onChange={(value) => handleValueChange('taxRate', value)}
              min={0}
              max={100}
              step={0.1}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Additional Fees
            </h2>
            <NumericInput
              label="Delivery Fee ($)"
              name="deliveryFee"
              value={values.deliveryFee}
              onChange={(value) => handleValueChange('deliveryFee', value)}
              min={0}
              step={1}
            />
            <NumericInput
              label="Installation Fee ($)"
              name="installationFee"
              value={values.installationFee}
              onChange={(value) => handleValueChange('installationFee', value)}
              min={0}
              step={1}
            />
            <NumericInput
              label="Storage Fee ($/day)"
              name="storageFee"
              value={values.storageFee}
              onChange={(value) => handleValueChange('storageFee', value)}
              min={0}
              step={1}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Business Rules
            </h2>
            <NumericInput
              label="Minimum Order Value ($)"
              name="minimumOrder"
              value={values.minimumOrder}
              onChange={(value) => handleValueChange('minimumOrder', value)}
              min={0}
              step={100}
            />
            <NumericInput
              label="Rush Order Fee (%)"
              name="rushOrderFee"
              value={values.rushOrderFee}
              onChange={(value) => handleValueChange('rushOrderFee', value)}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Shipping & Import
            </h2>
            <NumericInput
              label="Shipping Rate ($/lb)"
              name="shippingRate"
              value={values.shippingRate}
              onChange={(value) => handleValueChange('shippingRate', value)}
              min={0}
              step={0.1}
            />
            <NumericInput
              label="Import Tax Rate (%)"
              name="importTaxRate"
              value={values.importTaxRate}
              onChange={(value) => handleValueChange('importTaxRate', value)}
              min={0}
              max={100}
              step={0.1}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Currency Settings
            </h2>
            <NumericInput
              label="Exchange Rate (USD to Local)"
              name="exchangeRate"
              value={values.exchangeRate}
              onChange={(value) => handleValueChange('exchangeRate', value)}
              min={0}
              step={0.01}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center text-sm">
            {saved && (
              <span className="text-green-600 font-medium">
                Settings saved successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </form>

      <PricingCalculation />
    </div>
  );
}