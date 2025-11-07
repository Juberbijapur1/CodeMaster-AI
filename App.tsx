
import React from 'react';
import { useState } from 'react';
import AIAssistant from './components/AIAssistant';
import CodeEditor from './components/CodeEditor';
import { CodeIcon } from './components/icons/CodeIcon';

const App: React.FC = () => {
  const [activeCourse, setActiveCourse] = useState<string>('React Hooks');
  const courses = ['React Hooks', 'Advanced TypeScript', 'CSS Grid Mastery', 'Node.js Performance'];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gray-900 border-r border-gray-700 p-5 hidden md:block">
        <div className="flex items-center space-x-3 mb-10">
          <CodeIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">CodeMaster AI</h1>
        </div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Courses</h2>
        <ul>
          {courses.map(course => (
            <li key={course} className="mb-2">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveCourse(course); }}
                className={`block p-3 rounded-lg text-sm transition-colors ${activeCourse === course ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:bg-gray-800 text-gray-400'}`}
              >
                {course}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <CodeEditor activeCourse={activeCourse} />
      </main>

      {/* AI Assistant Sidebar */}
      <aside className="w-full md:w-96 lg:w-[450px] bg-gray-800/50 border-l border-gray-700 flex flex-col">
        <AIAssistant />
      </aside>
    </div>
  );
};

export default App;
