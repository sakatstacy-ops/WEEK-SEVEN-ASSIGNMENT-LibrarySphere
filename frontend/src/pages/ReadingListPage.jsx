import { useEffect, useState } from 'react';
import { api } from '../api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

export default function ReadingListPage() {
  const [catalog, setCatalog] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pendingBook, setPendingBook] = useState('');
  const [search, setSearch] = useState('');

  async function loadPage() {
    setError('');
    const [bookResult, listResult] = await Promise.all([
      api('/books'),
      api('/reading-list'),
    ]);
    setCatalog(bookResult.books);
    setReadingList(listResult.books);
  }

  useEffect(() => {
    loadPage()
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateReadingList(book, method) {
    setError('');
    setNotice('');
    setPendingBook(book._id);
    try {
      const result = await api(`/reading-list/${book._id}`, { method });
      setReadingList(result.books);
      setNotice(method === 'POST' ? 'Book added to your reading list.' : 'Book removed from your reading list.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPendingBook('');
    }
  }

  async function requestBorrow(book) {
    setError('');
    setNotice('');
    setPendingBook(book._id);
    try {
      await api('/borrow-requests', {
        method: 'POST',
        body: JSON.stringify({ bookId: book._id }),
      });
      await loadPage();
      setNotice(`Borrow request submitted for “${book.title}”.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPendingBook('');
    }
  }

  if (loading) {
    return <p className="state-message" role="status">Loading the catalog…</p>;
  }

  const savedIds = new Set(readingList.map((book) => book._id));
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const visibleCatalog = catalog.filter((book) => (
    `${book.title} ${book.author}`.toLocaleLowerCase().includes(normalizedSearch)
  ));

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Discover & borrow</p>
          <h1>Your reading list</h1>
          <p className="muted">Save a title first, then request a copy while it is available.</p>
        </div>
      </div>
      {error && <p className="notice error" role="alert">{error}</p>}
      {notice && <p className="notice success" role="status">{notice}</p>}
      {!error && catalog.length > 0 && <SearchBar onChange={setSearch} value={search} />}
      {!error && catalog.length === 0 ? (
        <p className="empty-state">There are no books in the catalog yet.</p>
      ) : !error && visibleCatalog.length === 0 ? (
        <p className="empty-state">No books match “{search}”.</p>
      ) : !error && (
        <div className="book-grid">
          {visibleCatalog.map((book) => (
            <BookCard
              book={book}
              isSaved={savedIds.has(book._id)}
              key={book._id}
              onRequestBorrow={requestBorrow}
              onToggleReadingList={(selectedBook) => (
                updateReadingList(
                  selectedBook,
                  savedIds.has(selectedBook._id) ? 'DELETE' : 'POST',
                )
              )}
              pending={pendingBook === book._id}
            />
          ))}
        </div>
      )}
    </>
  );
}
