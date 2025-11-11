import React from 'react';

interface CompletedSubtopicsPanelProps {
  isVisible: boolean;
  completedSubtopics: { id: string; title: string }[];
  onSubtopicsUpdate?: () => void;
}

const CompletedSubtopicsPanel: React.FC<CompletedSubtopicsPanelProps> = ({ 
  isVisible, 
  completedSubtopics
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-30 bg-white/95 border border-gray-400 rounded-md p-4 text-gray-900 text-sm shadow-lg max-w-md">
      <div className="select-none">
        <div className="font-bold mb-3 text-base">Completed Subtopics (Developer Panel)</div>
        <div className="max-h-64 overflow-y-auto">
          {completedSubtopics.length === 0 ? (
            <div className="text-gray-400 text-xs">None</div>
          ) : (
            <ul className="list-none pl-0 text-xs space-y-1">
              {completedSubtopics.map(s => (
                <li key={s.id} className="flex items-center justify-between text-gray-700 bg-gray-50 px-2 py-1 rounded">
                  <span>{s.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedSubtopicsPanel; 