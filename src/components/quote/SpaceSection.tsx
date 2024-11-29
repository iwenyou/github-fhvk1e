import React from 'react';
import { Trash2 } from 'lucide-react';
import { QuoteItemsTable } from './QuoteItemsTable';
import { Space, CabinetItem } from '../../types/quote';

interface SpaceSectionProps {
  space: Space;
  onUpdateSpace: (id: string, updates: Partial<Space>) => void;
  onDeleteSpace: (id: string) => void;
  onAddItem: (spaceId: string) => void;
  onUpdateItem: (spaceId: string, itemId: string, updates: Partial<CabinetItem>) => void;
  onDeleteItem: (spaceId: string, itemId: string) => void;
}

export function SpaceSection({
  space,
  onUpdateSpace,
  onDeleteSpace,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: SpaceSectionProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <input
          type="text"
          value={space.name}
          onChange={(e) => onUpdateSpace(space.id, { name: e.target.value })}
          className="text-lg font-medium text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none"
        />
        <button
          onClick={() => onDeleteSpace(space.id)}
          className="text-red-600 hover:text-red-900 p-1"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <QuoteItemsTable
        items={space.items}
        onAddItem={() => onAddItem(space.id)}
        onUpdateItem={(itemId, updates) => onUpdateItem(space.id, itemId, updates)}
        onDeleteItem={(itemId) => onDeleteItem(space.id, itemId)}
      />
    </div>
  );
}