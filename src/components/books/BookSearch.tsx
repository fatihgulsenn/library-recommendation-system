import React from 'react';

/**
 * BookSearch component props
 */
interface BookSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  genres: string[];
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  minRating: number;
  onMinRatingChange: (value: number) => void;
  years: number[];
  selectedYear: string;
  onYearChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}

/**
 * Modern BookSearch component with beautiful glass morphism
 *
 * @example
 * <BookSearch onSearch={handleSearch} />
 */
export function BookSearch({
  searchQuery,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
  minRating,
  onMinRatingChange,
  years,
  selectedYear,
  onYearChange,
  sortBy,
  onSortChange,
  showFavorites,
  onToggleFavorites,
}: BookSearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchQuery);
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-white/20 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="input-modern pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            className="btn-gradient px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5 inline mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Genre</label>
            <select
              className="input-modern"
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
            >
              <option value="all">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
            <select
              className="input-modern"
              value={minRating}
              onChange={(e) => onMinRatingChange(Number(e.target.value))}
            >
              <option value={0}>All Ratings</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Year</label>
            <select
              className="input-modern"
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-700 font-semibold">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="input-modern px-4 py-2.5 text-sm font-medium"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="rating">Rating</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-700 font-semibold">Favorites:</label>
            <button
              type="button"
              onClick={onToggleFavorites}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                showFavorites
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/80 text-slate-700 border border-slate-200'
              }`}
            >
              {showFavorites ? 'Only favorites' : 'All books'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
