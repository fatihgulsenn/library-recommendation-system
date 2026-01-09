import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getBooks, getFavorites, getReadingStatus, getAllReviews } from '@/services/api';
import { Book, Review } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BookGrid } from '@/components/books/BookGrid';
import { formatDate } from '@/utils/formatters';
import { handleApiError } from '@/utils/errorHandling';

interface StatusCounts {
  want: number;
  reading: number;
  finished: number;
}

export function Profile() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    want: 0,
    reading: 0,
    finished: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const userId = user?.id || '1';
        const [bookData, favoriteIds, allReviews] = await Promise.all([
          getBooks(),
          getFavorites(userId),
          getAllReviews(),
        ]);
        setBooks(bookData);
        setFavorites(favoriteIds);
        setReviews(allReviews.filter((review) => review.userId === userId));

        const statuses = await Promise.all(
          bookData.map((book) => getReadingStatus(book.id, userId))
        );
        const nextCounts = { want: 0, reading: 0, finished: 0 };
        statuses.forEach((status) => {
          if (!status) return;
          if (status.status === 'want') nextCounts.want += 1;
          if (status.status === 'reading') nextCounts.reading += 1;
          if (status.status === 'finished') nextCounts.finished += 1;
        });
        setStatusCounts(nextCounts);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user?.id]);

  useEffect(() => {
    const handleFavoritesUpdate = async () => {
      const userId = user?.id || '1';
      const favoriteIds = await getFavorites(userId);
      setFavorites(favoriteIds);
    };
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [user?.id]);

  const favoriteBooks = useMemo(
    () => books.filter((book) => favorites.includes(book.id)),
    [books, favorites]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-600 text-lg">Track your reading activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{user?.name || 'User'}</div>
                <div className="text-sm text-slate-600">{user?.email || 'demo@library.com'}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                  {user?.role || 'user'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Reading Status</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">{statusCounts.want}</div>
                <div className="text-xs opacity-90">Want</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{statusCounts.reading}</div>
                <div className="text-xs opacity-90">Reading</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{statusCounts.finished}</div>
                <div className="text-xs opacity-90">Finished</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Favorites</h3>
            <div className="text-5xl font-bold">{favoriteBooks.length}</div>
            <div className="text-sm opacity-90 mt-1">Saved books</div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Favorite Books</h2>
          <BookGrid books={favoriteBooks} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Reviews</h2>
          {reviews.length === 0 ? (
            <div className="text-slate-600">You have not posted any reviews yet.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-slate-500">{formatDate(review.createdAt)}</div>
                    <div className="text-amber-600 font-bold">{review.rating} / 5</div>
                  </div>
                  <div className="text-slate-800 font-medium">{review.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
