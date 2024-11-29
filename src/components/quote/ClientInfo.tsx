import React from 'react';
import { Input } from '../ui/Input';

interface ClientInfoProps {
  onNext: () => void;
}

export function ClientInfo({ onNext }: ClientInfoProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <div className="space-y-6">
        <Input
          label="Client Name"
          name="clientName"
          placeholder="Enter client's full name"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="client@example.com"
          required
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="(555) 555-5555"
          required
        />
        <Input
          label="Address"
          name="address"
          placeholder="Enter client's address"
          required
        />
        
        <div className="flex justify-end">
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