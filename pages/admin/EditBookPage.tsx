import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from '../../components/admin/BookForm';
import { Book } from '../../types';
import { getBookById, updateBook } from '../../services/mockApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
        setIsLoading(false);
        return;
    };
    const fetchBook = async () => {
        setIsLoading(true);
        try {
            const book = await getBookById(id);
            if(book) {
                setBookToEdit(book);
            }
        } catch(error) {
            console.error("Failed to fetch book for editing", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchBook();
  }, [id]);

  const handleUpdateBook = async (book: Book) => {
    await updateBook(book);
    navigate('/admin');
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
            <span className="ml-4">Loading Book for Editing...</span>
        </div>
    );
  }

  if (!bookToEdit) {
    return <div className="text-center text-xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">Book not found.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Edit Book</h2>
      <BookForm
        onSubmit={handleUpdateBook as (book: Book | Omit<Book, 'id' | 'coverImageUrl'>) => Promise<void>}
        initialBook={bookToEdit}
        buttonText="Update Book"
      />
    </div>
  );
};

export default EditBookPage;
