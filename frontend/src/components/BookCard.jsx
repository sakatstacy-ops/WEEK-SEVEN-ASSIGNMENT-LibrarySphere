export default function BookCard({
  book,
  isSaved,
  pending,
  onToggleReadingList,
  onRequestBorrow,
}) {
  return (
    <article className="book-card">
      <p className="eyebrow">{book.genre?.name || 'Library collection'}</p>
      <h2>{book.title}</h2>
      <p className="muted">{book.author}</p>
      <p className="book-description">{book.description}</p>
      <p className="availability">
        {book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'} available
      </p>
      <div className="button-row">
        <button
          className="secondary-button"
          disabled={pending}
          onClick={() => onToggleReadingList(book)}
          type="button"
        >
          {isSaved ? 'Remove saved title' : 'Add to reading list'}
        </button>
        {isSaved && (
          <button
            className="primary-button"
            disabled={pending || book.availableCopies < 1}
            onClick={() => onRequestBorrow(book)}
            type="button"
          >
            {pending ? 'Sending…' : 'Request a copy'}
          </button>
        )}
      </div>
    </article>
  );
}
