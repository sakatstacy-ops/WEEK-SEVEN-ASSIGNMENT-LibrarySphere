import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('passes the entered search text to its change handler', () => {
    const onChange = vi.fn();
    render(<SearchBar onChange={onChange} value="" />);

    fireEvent.change(screen.getByRole('searchbox', { name: /search the catalog/i }), {
      target: { value: 'quiet engine' },
    });

    expect(onChange).toHaveBeenCalledWith('quiet engine');
  });
});
