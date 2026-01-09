import { useState, useEffect } from 'react';
import { BookSearch } from '@/components/books/BookSearch';
import { BookGrid } from '@/components/books/BookGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getBooks, getFavorites } from '@/services/api';
import { Book } from '@/types';
import { handleApiError } from '@/utils/errorHandling';
import { useAuth } from '@/hooks/useAuth';

/**
 * Books page component with search and filtering
 */
export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadBooks();
  }, [user?.id]);

  useEffect(() => {
    applyFilters();
  }, [books, searchQuery, selectedGenre, minRating, selectedYear, sortBy, showFavorites, favoriteIds]);

  useEffect(() => {
    const handleFavoritesUpdate = async () => {
      const favorites = await getFavorites(user?.id || '1');
      setFavoriteIds(favorites);
    };
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [user?.id]);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
      const favorites = await getFavorites(user?.id || '1');
      setFavoriteIds(favorites);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const lowercaseQuery = searchQuery.trim().toLowerCase();
    let filtered = books.filter((book) => {
      const matchesQuery =
        !lowercaseQuery ||
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        book.genre.toLowerCase().includes(lowercaseQuery);
      const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
      const matchesRating = book.rating >= minRating;
      const matchesYear = selectedYear === 'all' || String(book.publishedYear) === selectedYear;
      const matchesFavorite = !showFavorites || favoriteIds.includes(book.id);
      return matchesQuery && matchesGenre && matchesRating && matchesYear && matchesFavorite;
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.publishedYear - a.publishedYear;
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      return a.title.localeCompare(b.title);
    });

    setFilteredBooks(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // TODO: Implement sort functionality
  const handleSort = (value: string) => {
    setSortBy(value);
  };

  const genres = Array.from(new Set(books.map((book) => book.genre))).sort();
  const years = Array.from(new Set(books.map((book) => book.publishedYear))).sort((a, b) => b - a);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">Book Catalog</span>
          </h1>
          <p className="text-slate-600 text-xl">
            Browse our collection of{' '}
            <span className="font-bold text-violet-600">{books.length}</span> amazing books
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <BookSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            sortBy={sortBy}
            onSortChange={handleSort}
            showFavorites={showFavorites}
            onToggleFavorites={() => setShowFavorites((value) => !value)}
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="glass-effect px-4 py-2 rounded-xl border border-white/20">
            <p className="text-slate-700 font-semibold">
              Showing <span className="text-violet-600">{filteredBooks.length}</span>{' '}
              {filteredBooks.length === 1 ? 'book' : 'books'}
            </p>
          </div>
        </div>

        {/* Book Grid */}
        <BookGrid books={filteredBooks} />

        {/* TODO: Implement pagination */}
        {filteredBooks.length > 12 && (
          <div className="mt-12 flex justify-center">
            <div className="glass-effect px-6 py-3 rounded-xl border border-white/20">
              <span className="text-slate-600 font-medium">Pagination coming soon...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
