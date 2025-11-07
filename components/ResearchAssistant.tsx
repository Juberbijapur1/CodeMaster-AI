
import React from 'react';
import { useState } from 'react';
import { geminiService } from '../services/geminiService';
import type { GroundingChunk } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';

const ResearchAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<{ text: string; chunks?: GroundingChunk[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const { text, chunks } = await geminiService.groundedSearch(prompt);
      setResult({ text, chunks: chunks as GroundingChunk[] | undefined });
    } catch (err) {
      setError('Failed to fetch research. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., What are the latest features in ECMAScript?"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm h-28 resize-none"
        />
        <button
          type="submit"
          disabled={!prompt || isLoading}
          className="w-full mt-2 p-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner /> : 'Research'}
        </button>
      </form>
      
      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      <div className="flex-1 overflow-y-auto pr-2">
        {isLoading && !result && (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner className="w-8 h-8"/>
          </div>
        )}
        {result && (
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2 text-cyan-400">Research Result:</h3>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{result.text}</p>
            {result.chunks && result.chunks.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-xs text-gray-400 uppercase">Sources:</h4>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {result.chunks.filter(c => c.web).map((chunk, index) => (
                    <li key={index}>
                      <a 
                        href={chunk.web?.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        {chunk.web?.title || chunk.web?.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAssistant;
