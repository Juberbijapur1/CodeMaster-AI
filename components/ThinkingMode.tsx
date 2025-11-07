import React from 'react';
import { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';

const ThinkingMode: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const response = await geminiService.complexQuery(prompt);
      setResult(response);
    } catch (err) {
      setError('Failed to process complex query. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponseForHtml = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(```[\s\S]*?```)/g);
    const formattedParts = parts.map(part => {
        if (part.startsWith('```')) {
            return part.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
        } else {
            return part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');
        }
    });
    return formattedParts.join('');
  }

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-300 text-sm font-semibold">Deep Dive Mode (gemini-2.5-pro)</p>
        <p className="text-yellow-400 text-xs mt-1">Ideal for complex architecture, system design, or in-depth problem-solving. Responses may take longer.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Design a scalable microservices architecture for a social media app..."
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm h-32 resize-none"
        />
        <button
          type="submit"
          disabled={!prompt || isLoading}
          className="w-full mt-2 p-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner /> : 'Initiate Deep Dive'}
        </button>
      </form>
      
      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      <div className="flex-1 overflow-y-auto pr-2">
        {isLoading && !result && (
          <div className="text-center p-4">
            <LoadingSpinner className="w-8 h-8 mx-auto" />
            <p className="mt-3 text-gray-400 text-sm">AI is thinking deeply...</p>
          </div>
        )}
        {result && (
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2 text-cyan-400">Deep Dive Result:</h3>
            <div className="text-sm text-gray-300 prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatResponseForHtml(result) }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingMode;