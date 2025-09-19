import React, { useState, useCallback } from 'react';
import { Book } from '../types';
import { generateNewBook } from '../services/geminiService';
import { addAIGeneratedBook } from '../services/mockApi';
import LoadingSpinner from './LoadingSpinner';

interface AIGenerateBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerationComplete: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const AIGenerateBookModal: React.FC<AIGenerateBookModalProps> = ({ isOpen, onClose, onGenerationComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newBookFromAI = await generateNewBook(prompt);
      if (newBookFromAI) {
        await addAIGeneratedBook(newBookFromAI); // Add to our mock DB
        onGenerationComplete(); // Signal parent to refetch
        setPrompt('');
        onClose();
      } else {
        setError("Failed to generate book. The AI might be busy. Please try again.");
      }
    } catch (e) {
      console.error("Book generation process failed:", e)
      setError("An unexpected error occurred during the generation process.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, onGenerationComplete, onClose]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Book with AI</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Describe the book you want to create. For example: "A sci-fi mystery set on a Martian colony."
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your book idea here..."
          className="w-full h-32 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 mr-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 flex items-center">
            {isLoading && <LoadingSpinner small />}
            {isLoading ? 'Generating...' : 'Generate Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGenerateBookModal;
