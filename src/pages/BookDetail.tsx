import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  getBook,
  getReviews,
  createReview,
  getReadingLists,
  updateReadingList,
  likeReview,
  replyToReview,
  deleteReview,
} from '@/services/api';
import { Book, ReadingList, Review } from '@/types';
import { formatDate, formatRating } from '@/utils/formatters';
import { handleApiError, showSuccess } from '@/utils/errorHandling';
import { useAuth } from '@/hooks/useAuth';
import { Modal } from '@/components/common/Modal';

/**
 * BookDetail page component
 */
export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const fallbackCover = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="#e2e8f0"/><text x="50%" y="50%" fill="#64748b" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">No cover</text></svg>'
  )}`;

  useEffect(() => {
    if (id) {
      loadBook(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBook = async (bookId: string) => {
    setIsLoading(true);
    try {
      const data = await getBook(bookId);
      if (!data) {
        navigate('/404');
        return;
      }
      setBook(data);
      const loadedReviews = await getReviews(bookId);
      setReviews(loadedReviews);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Implement add to reading list functionality
  const loadReadingLists = async () => {
    setIsLoadingLists(true);
    try {
      const lists = await getReadingLists(user?.id || '1');
      setReadingLists(lists);
      if (lists.length > 0) {
        setSelectedListId((current) => current || lists[0].id);
      } else {
        setSelectedListId('');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingLists(false);
    }
  };

  const handleAddToList = async () => {
    if (!book) return;
    await loadReadingLists();
    setIsListModalOpen(true);
  };

  const handleConfirmAddToList = async () => {
    if (!book || !selectedListId) {
      alert('Please select a reading list');
      return;
    }
    const list = readingLists.find((item) => item.id === selectedListId);
    if (!list) {
      alert('Reading list not found');
      return;
    }
    if (list.bookIds.includes(book.id)) {
      showSuccess('Book is already in that list.');
      setIsListModalOpen(false);
      return;
    }
    try {
      const updatedList = await updateReadingList(list.id, {
        bookIds: [...list.bookIds, book.id],
      });
      setReadingLists((current) =>
        current.map((item) => (item.id === updatedList.id ? updatedList : item))
      );
      setIsListModalOpen(false);
      showSuccess('Book added to reading list!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSubmitReview = async () => {
    if (!book) return;
    if (!reviewComment.trim()) {
      alert('Please write a comment');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const newReview = await createReview({
        bookId: book.id,
        userId: user?.id || '1',
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviews([newReview, ...reviews]);
      setReviewComment('');
      setReviewRating(5);
      setIsReviewModalOpen(false);
      showSuccess('Review submitted!');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getReviewerLabel = (reviewUserId: string) => {
    if (user?.id === reviewUserId) {
      return user.name || 'You';
    }
    if (reviewUserId.includes('@')) {
      return reviewUserId.split('@')[0] || 'User';
    }
    return `User ${reviewUserId}`;
  };

  const getReviewerInitials = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return 'U';
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'U';
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  };

  const handleLikeReview = async (reviewId: string) => {
    try {
      const updated = await likeReview(reviewId);
      if (updated) {
        setReviews((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleReplyChange = (reviewId: string, value: string) => {
    setReplyDrafts((current) => ({ ...current, [reviewId]: value }));
  };

  const handleSubmitReply = async (reviewId: string) => {
    const comment = replyDrafts[reviewId]?.trim();
    if (!comment) {
      alert('Please write a reply');
      return;
    }
    setIsSubmittingReply((current) => ({ ...current, [reviewId]: true }));
    try {
      const updated = await replyToReview(reviewId, {
        userId: user?.id || '1',
        comment,
      });
      if (updated) {
        setReviews((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        setReplyDrafts((current) => ({ ...current, [reviewId]: '' }));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmittingReply((current) => ({ ...current, [reviewId]: false }));
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Delete this review?')) {
      return;
    }
    try {
      await deleteReview(reviewId);
      setReviews((current) => current.filter((review) => review.id !== reviewId));
      showSuccess('Review deleted.');
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-violet-600 mb-8 transition-colors group glass-effect px-4 py-2 rounded-xl border border-white/20 w-fit"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-semibold">Back</span>
        </button>

        <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12">
            <div className="md:col-span-1">
              <div className="relative group">
                <img
                  src={book.coverImage || fallbackCover}
                  alt={book.title}
                  className="w-full rounded-2xl shadow-2xl group-hover:shadow-glow transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = fallbackCover;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-slate-600 mb-6 font-medium">by {book.author}</p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-xl border border-amber-200 shadow-sm">
                  <svg
                    className="w-5 h-5 text-amber-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-lg font-bold text-amber-700">
                    {formatRating(book.rating)}
                  </span>
                </div>

                <span className="badge-gradient px-4 py-2 text-sm">{book.genre}</span>

                <div className="flex items-center text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-semibold">{book.publishedYear}</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full mr-3"></span>
                  Description
                </h2>
                <p className="text-slate-700 leading-relaxed text-lg">{book.description}</p>
              </div>

              <div className="mb-8 glass-effect p-4 rounded-xl border border-white/20">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">ISBN:</span> {book.isbn}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" onClick={handleAddToList}>
                  <svg
                    className="w-5 h-5 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add to Reading List
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsReviewModalOpen(true)}>
                  <svg
                    className="w-5 h-5 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Write a Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 glass-effect rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full mr-3"></span>
            Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <p className="text-slate-600 text-lg">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => {
                const label = getReviewerLabel(review.userId);
                const initials = getReviewerInitials(label);
                return (
                  <div
                    key={review.id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm"
                  >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                          {initials}
                        </div>
                        <div>
                          <div className="text-slate-800 font-semibold">{label}</div>
                          <div className="text-xs text-slate-500">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                    <div className="text-amber-600 font-bold">{review.rating} / 5</div>
                  </div>
                  {(user?.id === review.userId || user?.role === 'admin') && (
                    <div className="mb-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <p className="text-slate-700">{review.comment}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleLikeReview(review.id)}
                      className="text-sm font-semibold text-slate-600 hover:text-violet-600"
                    >
                      👍 Like {review.likes ? `(${review.likes})` : ''}
                    </button>
                    <span className="text-sm text-slate-400">
                      Replies {review.replies?.length ? `(${review.replies.length})` : ''}
                    </span>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Reply
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={replyDrafts[review.id] || ''}
                        onChange={(e) => handleReplyChange(review.id, e.target.value)}
                        placeholder="Write a reply"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSubmitReply(review.id)}
                        disabled={isSubmittingReply[review.id]}
                      >
                        {isSubmittingReply[review.id] ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                  </div>

                  {review.replies && review.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {review.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-3"
                        >
                          <div className="text-xs text-slate-500 mb-1">
                            {getReviewerLabel(reply.userId)} · {formatDate(reply.createdAt)}
                          </div>
                          <div className="text-sm text-slate-700">{reply.comment}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
      </div>
      <Modal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title="Add to Reading List"
      >
        <div>
          {isLoadingLists ? (
            <div className="py-4 text-slate-600">Loading lists...</div>
          ) : readingLists.length === 0 ? (
            <div className="py-4 text-slate-600">
              No reading lists yet. Create one in the Reading Lists page.
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select list</label>
              <select
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {readingLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleConfirmAddToList}
              className="flex-1"
              disabled={isLoadingLists || readingLists.length === 0}
            >
              Add to List
            </Button>
            <Button variant="secondary" onClick={() => setIsListModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Review"
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} stars
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts about this book"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px] resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleSubmitReview}
              disabled={isSubmittingReview}
              className="flex-1"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsReviewModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
