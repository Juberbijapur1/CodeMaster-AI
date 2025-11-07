import React from 'react';
import { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface CodeEditorProps {
  activeCourse: string;
}

const courseCodeSamples: Record<string, string> = {
    'React Hooks': `import { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearTimeout(timerId);
  }, []); // Note: empty dependency array means this runs only on mount

  return <h1>I've rendered {count} times!</h1>;
}`,
    'Advanced TypeScript': `interface User {
  id: number;
  name: string;
  email?: string;
}

type PartialUser = Partial<User>; // Makes all properties optional
type ReadonlyUser = Readonly<User>; // Makes all properties readonly

function updateUser(id: number, update: PartialUser) {
  // ... implementation
  console.log(\`Updating user \${id} with\`, update);
}

updateUser(1, { name: 'New Name' });`,
    'CSS Grid Mastery': `
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.item {
  background-color: #3498db;
  padding: 20px;
  border-radius: 5px;
  color: white;
}`,
    'Node.js Performance': `const { performance } = require('perf_hooks');

function someSlowFunction() {
  let sum = 0;
  for (let i = 0; i < 1000000000; i++) {
    sum += i;
  }
  return sum;
}

const t0 = performance.now();
someSlowFunction();
const t1 = performance.now();

console.log(\`someSlowFunction took \${(t1 - t0).toFixed(2)} milliseconds.\`);`
}

const CodeEditor: React.FC<CodeEditorProps> = ({ activeCourse }) => {
  const [code, setCode] = useState<string>(courseCodeSamples[activeCourse] || '');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  React.useEffect(() => {
    setCode(courseCodeSamples[activeCourse] || '');
    setAiResponse('');
  }, [activeCourse]);

  const handleAction = async (action: 'explain' | 'refactor') => {
    if (!code.trim() || isLoading) return;
    setIsLoading(true);
    setAiResponse('');
    try {
        let response = '';
        if (action === 'explain') {
            response = await geminiService.getCodeExplanation(code);
        } else {
            response = await geminiService.refactorCode(code);
        }
        setAiResponse(response);
    } catch (error) {
        console.error(`Error with ${action}:`, error);
        setAiResponse(`Sorry, an error occurred while trying to ${action} the code.`);
    } finally {
        setIsLoading(false);
    }
  }

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
    <div className="flex flex-col h-full">
        <header className="mb-6">
            <h1 className="text-3xl font-bold text-white">{activeCourse}</h1>
            <p className="text-gray-400 mt-1">Interactive code editor and AI analysis</p>
        </header>
        <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">
            <div className="lg:w-1/2 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="code-editor" className="text-sm font-medium text-gray-400">Your Code</label>
                    <div className="flex space-x-2">
                        <button onClick={() => handleAction('explain')} disabled={isLoading} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md disabled:opacity-50">Explain</button>
                        <button onClick={() => handleAction('refactor')} disabled={isLoading} className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-md disabled:opacity-50">Refactor</button>
                    </div>
                </div>
                <textarea
                    id="code-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    spellCheck="false"
                />
            </div>
            <div className="lg:w-1/2 flex flex-col">
                <label className="text-sm font-medium text-gray-400 mb-2">AI Response</label>
                <div className="flex-1 w-full p-4 bg-gray-800 border border-gray-700 rounded-lg overflow-y-auto">
                    {isLoading ? (
                         <div className="flex items-center justify-center h-full">
                            <LoadingSpinner className="w-8 h-8 text-cyan-400" />
                        </div>
                    ) : aiResponse ? (
                        <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formatResponseForHtml(aiResponse) }}></div>
                    ) : (
                        <div className="text-gray-500 text-center py-10">Use "Explain" or "Refactor" to get AI feedback on your code.</div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default CodeEditor;