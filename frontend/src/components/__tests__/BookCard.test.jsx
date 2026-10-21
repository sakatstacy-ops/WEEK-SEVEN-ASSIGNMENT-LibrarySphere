import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BookCard from '../BookCard';

const book = {
  _id: 'book-1',
  title: 'The Quiet Engine',
  author: 'S. R. Kade',
  description: 'Engineers investigate a machine on a remote moon.',
  availableCopies: 2,
  genre: { name: 'Science Fiction' },
};

describe('BookCard', () => {
  it('renders the book details and reports a reading-list action', () => {
    const onToggleReadingList = vi.fn();
    const onRequestBorrow = vi.fn();

    render(
      <BookCard
        book={book}
        isSaved={false}
        onRequestBorrow={onRequestBorrow}
        onToggleReadingList={onToggleReadingList}
        pending={false}
      />,
    );

    expect(screen.getByRole('heading', { name: 'The Quiet Engine' })).toBeInTheDocument();
    expect(screen.getByText('S. R. Kade')).toBeInTheDocument();
    expect(screen.getByText('2 copies available')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Add to reading list' }));
    expect(onToggleReadingList).toHaveBeenCalledWith(book);
  });
});
