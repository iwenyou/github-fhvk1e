import React from 'react';
import { PresetForm } from '../components/preset/PresetForm';

export function PresetValues() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Preset Values</h1>
        <p className="mt-2 text-gray-600">
          Manage default values and calculation settings for quotes
        </p>
      </div>
      <PresetForm />
    </div>
  );
}