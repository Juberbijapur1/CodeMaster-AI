
import React from 'react';
import { useState } from 'react';
import { AITool } from '../types';
import Chatbot from './Chatbot';
import ImageAnalyzer from './ImageAnalyzer';
import ResearchAssistant from './ResearchAssistant';
import ThinkingMode from './ThinkingMode';
import { BotIcon } from './icons/BotIcon';
import { ImageIcon } from './icons/ImageIcon';
import { SearchIcon } from './icons/SearchIcon';
import { BrainIcon } from './icons/BrainIcon';

const toolComponents: Record<AITool, React.FC> = {
  [AITool.Chat]: Chatbot,
  [AITool.Image]: ImageAnalyzer,
  [AITool.Search]: ResearchAssistant,
  [AITool.Thinking]: ThinkingMode,
};

const toolIcons: Record<AITool, React.ReactNode> = {
    [AITool.Chat]: <BotIcon className="w-5 h-5" />,
    [AITool.Image]: <ImageIcon className="w-5 h-5" />,
    [AITool.Search]: <SearchIcon className="w-5 h-5" />,
    [AITool.Thinking]: <BrainIcon className="w-5 h-5" />,
}

const AIAssistant: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AITool>(AITool.Chat);
  const ActiveComponent = toolComponents[activeTool];

  return (
    <div className="flex flex-col h-full bg-gray-900/70">
      <div className="flex-shrink-0 border-b border-gray-700">
        <nav className="flex space-x-1 p-2">
          {(Object.keys(toolComponents) as AITool[]).map(tool => (
            <button
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 text-xs font-medium rounded-lg transition-colors ${
                activeTool === tool
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {toolIcons[tool]}
              <span className="hidden lg:inline">{tool}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default AIAssistant;
