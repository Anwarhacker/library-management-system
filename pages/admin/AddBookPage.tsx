import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../../components/admin/BookForm';
import { Book } from '../../types';
import { addBook } from '../../services/mockApi';

const AddBookPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddBook = async (bookData: Omit<Book, 'id' | 'coverImageUrl'>) => {
    await addBook(bookData);
    navigate('/admin');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Add New Book</h2>
      <BookForm onSubmit={handleAddBook} buttonText="Add Book" />
    </div>
  );
};

export default AddBookPage;
