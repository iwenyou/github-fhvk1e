import React from 'react';
import { Input } from '../ui/Input';

interface SpaceDetailsProps {
  onBack: () => void;
  onNext: () => void;
}

export function SpaceDetails({ onBack, onNext }: SpaceDetailsProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Space Type
            </label>
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option>Kitchen</option>
              <option>Bathroom</option>
              <option>Closet</option>
              <option>Office</option>
              <option>Other</option>
            </select>
          </div>
          
          <Input
            label="Room Dimensions"
            name="dimensions"
            placeholder="e.g., 12' x 10'"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter any special requirements or notes about the space"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next Step
          </button>
        </div>
      </div>
    </form>
  );
}