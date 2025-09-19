
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link to={`/book/${book.id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <img 
          src={book.coverImageUrl} 
          alt={`Cover for ${book.title}`} 
          className="w-full h-80 object-cover" 
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
