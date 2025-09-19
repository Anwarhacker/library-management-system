import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import AIGenerateBookModal from './AIGenerateBookModal';
import { getBooks } from '../services/mockApi';
import LoadingSpinner from './LoadingSpinner';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


const BookList: React.FC = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const books = await getBooks();
        setAllBooks(books);
    } catch (err) {
        setError('Failed to fetch books. Please try again later.');
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const categories = useMemo(() => ['All', ...new Set(allBooks.map(book => book.category))], [allBooks]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allBooks, searchTerm, selectedCategory]);

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 sticky top-4 z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PlusIcon />
            AI Generate Book
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
            <span className="text-xl ml-4">Loading Library...</span>
        </div>
      )}

      {error && <div className="text-center py-16 text-red-500">{error}</div>}

      {!isLoading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
            ))}
        </div>
      )}
      
      {!isLoading && !error && filteredBooks.length === 0 && (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No books found</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter.</p>
        </div>
      )}

      <AIGenerateBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerationComplete={fetchBooks}
      />
    </div>
  );
};

export default BookList;
