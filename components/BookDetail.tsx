import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book } from '../types';
import { generateBookSummary, findSimilarBooks } from '../services/geminiService';
import { getBookById } from '../services/mockApi';
import LoadingSpinner from './LoadingSpinner';

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">
      {children}
    </span>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState(true);

  const [summary, setSummary] = useState('');
  const [similarBooks, setSimilarBooks] = useState<string[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  
  useEffect(() => {
    const fetchBook = async () => {
        if (!id) return;
        setIsLoadingBook(true);
        try {
            const fetchedBook = await getBookById(id);
            if (fetchedBook) {
                setBook(fetchedBook);
            } else {
                setBook(null);
            }
        } catch (error) {
            console.error("Failed to fetch book", error);
            setBook(null);
        } finally {
            setIsLoadingBook(false);
        }
    };
    fetchBook();
  }, [id]);

  const handleGenerateSummary = useCallback(async () => {
    if (!book) return;
    setIsLoadingSummary(true);
    setSummary('');
    const result = await generateBookSummary(book.title, book.author);
    setSummary(result);
    setIsLoadingSummary(false);
  }, [book]);

  const handleFindSimilar = useCallback(async () => {
    if (!book) return;
    setIsLoadingSimilar(true);
    setSimilarBooks([]);
    const result = await findSimilarBooks(book.title, book.author);
    setSimilarBooks(result);
    setIsLoadingSimilar(false);
  }, [book]);

  if (isLoadingBook) {
    return (
        <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
            <span className="text-xl ml-4">Loading Book Details...</span>
        </div>
    );
  }

  if (!book) {
    return <div className="text-center text-xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">Book not found.</div>;
  }

  return (
    <div>
        <Link to="/" className="inline-flex items-center mb-6 text-indigo-600 dark:text-indigo-400 hover:underline">
            <BackIcon />
            Back to Library
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
                <div className="md:flex-shrink-0">
                    <img className="h-96 w-full object-cover md:w-64" src={book.coverImageUrl} alt={`Cover for ${book.title}`} />
                </div>
                <div className="p-8 flex-grow">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 dark:text-indigo-400 font-semibold">{book.category}</div>
                    <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black dark:text-white">{book.title}</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">{book.author}</p>
                    
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{book.description}</p>
                    
                    <div className="mt-6">
                        <p><span className="font-bold">Published:</span> {book.publishedDate}</p>
                        <p><span className="font-bold">ISBN:</span> {book.isbn}</p>
                    </div>

                     <div className="mt-6">
                        {book.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                    </div>
                </div>
            </div>
            
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">AI Librarian Features</h2>
                <div className="space-y-6">
                    <div>
                        <button onClick={handleGenerateSummary} disabled={isLoadingSummary} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-colors">
                            {isLoadingSummary ? 'Generating...' : 'Generate AI Summary'}
                        </button>
                        {isLoadingSummary && <LoadingSpinner />}
                        {summary && (
                            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                               <p className="text-gray-800 dark:text-gray-200">{summary}</p>
                            </div>
                        )}
                    </div>
                     <div>
                        <button onClick={handleFindSimilar} disabled={isLoadingSimilar} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 dark:disabled:bg-green-800 transition-colors">
                           {isLoadingSimilar ? 'Searching...' : 'Find Similar Books'}
                        </button>
                        {isLoadingSimilar && <LoadingSpinner />}
                        {similarBooks.length > 0 && (
                            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
                                   {similarBooks.map((similarBook, index) => <li key={index}>{similarBook}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default BookDetail;
