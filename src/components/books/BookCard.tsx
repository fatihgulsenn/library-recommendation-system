import { useEffect, useState, type MouseEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '@/types';
import { formatRating } from '@/utils/formatters';
import { Button } from '@/components/common/Button';
import { getFavorites, toggleFavorite, getReadingStatus, setReadingStatus } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

/**
 * BookCard component props
 */
interface BookCardProps {
  book: Book;
}

/**
 * Modern BookCard with beautiful hover effects and gradients
 *
 * @example
 * <BookCard book={book} />
 */
export function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [readingStatus, setReadingStatusState] = useState<'want' | 'reading' | 'finished' | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const fallbackCover = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="#e2e8f0"/><text x="50%" y="50%" fill="#64748b" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">No cover</text></svg>'
  )}`;

  useEffect(() => {
    const loadUserState = async () => {
      const userId = user?.id || '1';
      const favorites = await getFavorites(userId);
      setIsFavorite(favorites.includes(book.id));
      const status = await getReadingStatus(book.id, userId);
      setReadingStatusState((status?.status as 'want' | 'reading' | 'finished') || '');
    };
    loadUserState();
  }, [book.id, user?.id]);

  const handleClick = () => {
    navigate(`/books/${book.id}`);
  };

  const handleToggleFavorite = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsUpdating(true);
    try {
      const userId = user?.id || '1';
      const updated = await toggleFavorite(book.id, userId);
      setIsFavorite(updated.includes(book.id));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    event.stopPropagation();
    const nextStatus = event.target.value as 'want' | 'reading' | 'finished';
    setIsUpdating(true);
    try {
      const userId = user?.id || '1';
      const updated = await setReadingStatus(book.id, userId, nextStatus);
      setReadingStatusState(updated.status as 'want' | 'reading' | 'finished');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="glass-effect rounded-2xl overflow-hidden card-hover cursor-pointer group border border-white/20 hover-glow"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={book.coverImage || fallbackCover}
          alt={book.title}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = fallbackCover;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            View Details
          </Button>
        </div>

        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition ${
            isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          disabled={isUpdating}
        >
          <svg
            className="w-5 h-5"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>

        {/* Floating Badge */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-slate-900">{formatRating(book.rating)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-slate-600 mb-4 font-medium">{book.author}</p>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
          <select
            value={readingStatus}
            onChange={handleStatusChange}
            onClick={(event) => event.stopPropagation()}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="">Select status</option>
            <option value="want">Want to read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="badge-modern">{book.genre}</span>
          <div className="flex items-center text-slate-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-medium">{book.publishedYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
