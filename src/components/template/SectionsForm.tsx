import React from 'react';
import { TemplateSections } from '../../types/template';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface SectionsFormProps {
  sections: TemplateSections;
  onChange: (sections: TemplateSections) => void;
}

export function SectionsForm({ sections, onChange }: SectionsFormProps) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(Object.entries(sections));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedSections = { ...sections };
    items.forEach(([key], index) => {
      updatedSections[key as keyof TemplateSections].order = index + 1;
    });

    onChange(updatedSections);
  };

  const sortedSections = Object.entries(sections).sort(
    ([, a], [, b]) => a.order - b.order
  );

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {sortedSections.map(([key, section], index) => (
                <Draggable
                  key={key}
                  draggableId={key}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={section.enabled}
                            onChange={(e) =>
                              onChange({
                                ...sections,
                                [key]: {
                                  ...section,
                                  enabled: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-medium">
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .split(' ')
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(' ')}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Order: {section.order}
                        </span>
                      </div>

                      {key === 'quoteDetails' && section.enabled && (
                        <div className="mt-4 pl-8">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Visible Columns
                          </h4>
                          <div className="space-y-2">
                            {section.columns.map((column) => (
                              <div
                                key={column.key}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={column.enabled}
                                  onChange={(e) =>
                                    onChange({
                                      ...sections,
                                      quoteDetails: {
                                        ...section,
                                        columns: section.columns.map((c) =>
                                          c.key === column.key
                                            ? {
                                                ...c,
                                                enabled: e.target.checked,
                                              }
                                            : c
                                        ),
                                      },
                                    })
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label className="ml-2 text-sm text-gray-900">
                                  {column.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {key === 'footer' && section.enabled && (
                        <div className="mt-4 pl-8 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Footer Notes
                            </label>
                            <textarea
                              value={section.notes}
                              onChange={(e) =>
                                onChange({
                                  ...sections,
                                  footer: {
                                    ...section,
                                    notes: e.target.value,
                                  },
                                })
                              }
                              rows={2}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Terms
                            </label>
                            <textarea
                              value={section.terms}
                              onChange={(e) =>
                                onChange({
                                  ...sections,
                                  footer: {
                                    ...section,
                                    terms: e.target.value,
                                  },
                                })
                              }
                              rows={2}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}