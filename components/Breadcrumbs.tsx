import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { getBookById } from '../services/mockApi';

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const [bookTitle, setBookTitle] = useState<string | null>(null);

  const pathnames = location.pathname.split('/').filter((x) => x);
  
  useEffect(() => {
    const fetchBookTitle = async () => {
        const isBookPage = pathnames.includes('book') || pathnames.includes('edit');
        if (isBookPage && params.id) {
            try {
                const book = await getBookById(params.id);
                setBookTitle(book ? book.title : null);
            } catch {
                setBookTitle(null);
            }
        } else {
            setBookTitle(null);
        }
    };
    fetchBookTitle();
  }, [location.pathname, params.id, pathnames]);

  if (pathnames.length === 0 || location.pathname === '/login') {
    return null; // Don't show on homepage or login page
  }

  const getDisplayName = (name: string) => {    
    if (name === 'admin') return 'Admin Panel';
    if (name === 'add') return 'Add Book';
    if (name === 'edit') return 'Edit Book';
    
    // Check if the name matches the ID from params and we have a title
    if (params.id && name === params.id && bookTitle) {
        return bookTitle;
    }

    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  // Filter out redundant path segments for cleaner breadcrumbs
  const filteredPathnames = pathnames.filter(name => !['book', 'edit'].includes(name));

  return (
    <nav aria-label="breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <ol className="list-none p-0 inline-flex items-center flex-wrap">
        <li className="flex items-center">
          <Link to="/" className="flex items-center hover:underline hover:text-indigo-500">
            <HomeIcon />
            Library
          </Link>
          <span className="mx-2">/</span>
        </li>
        {filteredPathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, pathnames.indexOf(name) + 1).join('/')}`;
          const isLast = index === filteredPathnames.length - 1;
          const displayName = getDisplayName(name);

          // Don't render a breadcrumb for an ID if we couldn't find a title
          if(name === params.id && !bookTitle && pathnames.includes('book')) return null;

          return (
            <li key={routeTo} className="flex items-center">
              {!isLast ? (
                <Link to={routeTo} className="hover:underline hover:text-indigo-500">
                  {displayName}
                </Link>
              ) : (
                <span className="text-gray-800 dark:text-gray-200 font-semibold" aria-current="page">
                  {displayName}
                </span>
              )}
              {!isLast && <span className="mx-2">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
