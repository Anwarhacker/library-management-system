import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

interface BookFormProps {
    onSubmit: (book: Book | Omit<Book, 'id' | 'coverImageUrl'>) => Promise<void> | void;
    initialBook?: Omit<Book, 'id' | 'coverImageUrl'> & { id?: string; coverImageUrl?: string };
    buttonText: string;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialBook, buttonText }) => {
    // FIX: Initialize state correctly. `tags` should be a string for the form input.
    // Spreading initialBook first and then overriding `tags` and other fields ensures
    // properties like `id` are preserved while maintaining correct types for form fields.
    const [book, setBook] = useState({
        ...initialBook,
        title: initialBook?.title ?? '',
        author: initialBook?.author ?? '',
        isbn: initialBook?.isbn ?? '',
        description: initialBook?.description ?? '',
        category: initialBook?.category ?? '',
        publishedDate: initialBook?.publishedDate ?? '',
        tags: initialBook?.tags?.join(', ') ?? '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // FIX: This useEffect now correctly handles prop updates without type errors.
    // By spreading `initialBook` and then overriding `tags` with a string, we ensure
    // the state passed to `setBook` matches the inferred state type.
    useEffect(() => {
        if (initialBook) {
            setBook({
                ...initialBook,
                tags: Array.isArray(initialBook.tags) ? initialBook.tags.join(', ') : '',
            });
        }
    }, [initialBook]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBook(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // FIX: With `book.tags` now consistently a string, this `split` call is safe.
        const bookData = {
            ...book,
            tags: book.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };
        
        try {
            await onSubmit(bookData);
        } catch (error) {
            console.error("Failed to submit book form", error);
            alert(`Error: ${buttonText} failed. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <fieldset disabled={isSubmitting} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" name="title" id="title" value={book.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 disabled:opacity-50"/>
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                        <input type="text" name="author" id="author" value={book.author} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 disabled:opacity-50"/>
                    </div>
                    <div>
                        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</label>
                        <input type="text" name="isbn" id="isbn" value={book.isbn} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 disabled:opacity-50"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <input type="text" name="category" id="category" value={book.category} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 disabled:opacity-50"/>
                    </div>
                    <div>
                        <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Published Date</label>
                        <input type="date" name="publishedDate" id="publishedDate" value={book.publishedDate} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 disabled:opacity-50"/>
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
                        <input type="text" name="tags" id="tags" value={book.tags} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 disabled:opacity-50"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea name="description" id="description" value={book.description} onChange={handleChange} required rows={4} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 disabled:opacity-50"></textarea>
                </div>
            </fieldset>
             <div className="flex justify-end gap-4">
                 <button type="button" onClick={() => navigate('/admin')} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 flex items-center">
                    {isSubmitting && <LoadingSpinner small />}
                    {isSubmitting ? 'Saving...' : buttonText}
                </button>
            </div>
        </form>
    );
};

export default BookForm;
