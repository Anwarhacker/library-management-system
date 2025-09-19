import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { getBooks, deleteBook } from '../../services/mockApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


const AdminDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const books = await getBooks();
        setBooks(books);
    } catch (err) {
        setError('Failed to fetch books.');
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);


  const handleDelete = async (id: string, title: string) => {
    if(window.confirm(`Are you sure you want to delete "${title}"?`)) {
        try {
            await deleteBook(id);
            fetchBooks(); // Refetch books after deletion
        } catch(err) {
            alert('Failed to delete book.');
        }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Manage Books</h2>
            <Link 
                to="/admin/add" 
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <PlusIcon />
                Add New Book
            </Link>
        </div>
        {isLoading && (
            <div className="flex justify-center items-center py-16">
                <LoadingSpinner />
                <span className="ml-4">Loading Books...</span>
            </div>
        )}
        {error && <div className="text-center py-16 text-red-500">{error}</div>}

        {!isLoading && !error && (
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Author</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">ISBN</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {books.map(book => (
                            <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-3 font-medium">{book.title}</td>
                                <td className="p-3">{book.author}</td>
                                <td className="p-3">{book.category}</td>
                                <td className="p-3">{book.isbn}</td>
                                <td className="p-3 text-right">
                                    <Link to={`/admin/edit/${book.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(book.id, book.title)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;
