
import React from 'react';
import { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { ImageIcon } from './icons/ImageIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

const ImageAnalyzer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Image size should be less than 4MB.');
        return;
      }
      setError('');
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!prompt || !imageFile || isLoading) return;

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          const response = await geminiService.analyzeImage(prompt, base64String, imageFile.type);
          setResult(response);
      };
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
        {image ? (
          <img src={image} alt="Preview" className="max-h-48 mx-auto rounded-md" />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <ImageIcon className="w-10 h-10 mb-2" />
            <p>Click to upload an image</p>
            <p className="text-xs mt-1">(PNG, JPG, WEBP, max 4MB)</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      {image && (
          <>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Explain this architecture diagram..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm h-24 resize-none"
                rows={3}
            />
            <button
                onClick={handleSubmit}
                disabled={!prompt || isLoading}
                className="w-full p-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? <LoadingSpinner /> : 'Analyze Image'}
            </button>
          </>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2 text-cyan-400">Analysis Result:</h3>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
