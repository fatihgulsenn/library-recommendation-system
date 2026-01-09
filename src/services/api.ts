import { Book, ReadingList, Review, Recommendation } from '@/types';
import { mockBooks, mockReadingLists } from './mockData';

/**
 * ============================================================================
 * API SERVICE LAYER - BACKEND COMMUNICATION
 * ============================================================================
 *
 * ⚠️ IMPORTANT: This file currently uses MOCK DATA for all API calls.
 *
 * TO IMPLEMENT AWS BACKEND:
 * Follow the step-by-step guide in IMPLEMENTATION_GUIDE.md
 *
 * Quick Reference:
 * - Week 2: Implement Books API (getBooks, getBook, createBook, etc.)
 * - Week 2: Implement Reading Lists API
 * - Week 3: Add Cognito authentication headers
 * - Week 4: Implement AI recommendations with Bedrock
 *
 * ============================================================================
 * IMPLEMENTATION CHECKLIST:
 * ============================================================================
 *
 * [ ] Week 1: Set up AWS account and first Lambda function
 * [ ] Week 2: Create DynamoDB tables (Books, ReadingLists)
 * [ ] Week 2: Deploy Lambda functions for Books API
 * [ ] Week 2: Deploy Lambda functions for Reading Lists API
 * [ ] Week 2: Set VITE_API_BASE_URL in .env file
 * [ ] Week 3: Set up Cognito User Pool
 * [ ] Week 3: Install aws-amplify: npm install aws-amplify
 * [ ] Week 3: Configure Amplify in src/main.tsx
 * [ ] Week 3: Update AuthContext with Cognito functions
 * [ ] Week 3: Implement getAuthHeaders() function below
 * [ ] Week 3: Add Cognito authorizer to API Gateway
 * [ ] Week 4: Deploy Bedrock recommendations Lambda
 * [ ] Week 4: Update getRecommendations() function
 * [ ] Week 4: Remove all mock data returns
 * [ ] Week 4: Delete src/services/mockData.ts
 *
 * ============================================================================
 */

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK_API = !API_BASE_URL;

import { fetchAuthSession } from 'aws-amplify/auth';

const MOCK_LISTS_STORAGE_KEY = 'mockReadingLists';
const MOCK_REVIEWS_STORAGE_KEY = 'mockReviews';
const MOCK_FAVORITES_STORAGE_KEY = 'mockFavorites';
const MOCK_STATUS_STORAGE_KEY = 'mockReadingStatus';

function loadMockReadingLists(): ReadingList[] {
  try {
    const raw = localStorage.getItem(MOCK_LISTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as ReadingList[];
    }
  } catch {
    // Ignore storage errors and fall back to defaults.
  }
  return mockReadingLists;
}

function saveMockReadingLists(lists: ReadingList[]): void {
  localStorage.setItem(MOCK_LISTS_STORAGE_KEY, JSON.stringify(lists));
}

function loadMockReviews(): Review[] {
  try {
    const raw = localStorage.getItem(MOCK_REVIEWS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Review[];
    }
  } catch {
    // Ignore storage errors and fall back to defaults.
  }
  return [
    {
      id: '1',
      bookId: '1',
      userId: '1',
      rating: 5,
      comment: 'Absolutely loved this book! A must-read.',
      createdAt: '2024-11-01T10:00:00Z',
    },
  ];
}

function saveMockReviews(reviews: Review[]): void {
  localStorage.setItem(MOCK_REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
}

function loadMockFavorites(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(MOCK_FAVORITES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Record<string, string[]>;
    }
  } catch {
    // Ignore storage errors and fall back to defaults.
  }
  return {};
}

function saveMockFavorites(favorites: Record<string, string[]>): void {
  localStorage.setItem(MOCK_FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

function loadMockReadingStatus(): Record<string, Record<string, { status: string; updatedAt: string }>> {
  try {
    const raw = localStorage.getItem(MOCK_STATUS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Record<string, Record<string, { status: string; updatedAt: string }>>;
    }
  } catch {
    // Ignore storage errors and fall back to defaults.
  }
  return {};
}

function saveMockReadingStatus(
  statusMap: Record<string, Record<string, { status: string; updatedAt: string }>>
): void {
  localStorage.setItem(MOCK_STATUS_STORAGE_KEY, JSON.stringify(statusMap));
}

export async function getFavorites(userId: string): Promise<string[]> {
  if (USE_MOCK_API) {
    const favorites = loadMockFavorites();
    return Promise.resolve(favorites[userId] || []);
  }
  return Promise.resolve([]);
}

export async function toggleFavorite(bookId: string, userId: string): Promise<string[]> {
  if (USE_MOCK_API) {
    const favorites = loadMockFavorites();
    const current = favorites[userId] || [];
    const updated = current.includes(bookId)
      ? current.filter((id) => id !== bookId)
      : [...current, bookId];
    favorites[userId] = updated;
    saveMockFavorites(favorites);
    window.dispatchEvent(new Event('favoritesUpdated'));
    return Promise.resolve(updated);
  }
  return Promise.resolve([]);
}

export async function getReadingStatus(
  bookId: string,
  userId: string
): Promise<{ status: string; updatedAt: string } | null> {
  if (USE_MOCK_API) {
    const statusMap = loadMockReadingStatus();
    const entry = statusMap[userId]?.[bookId];
    return Promise.resolve(entry || null);
  }
  return Promise.resolve(null);
}

export async function setReadingStatus(
  bookId: string,
  userId: string,
  status: 'want' | 'reading' | 'finished'
): Promise<{ status: string; updatedAt: string }> {
  if (USE_MOCK_API) {
    const statusMap = loadMockReadingStatus();
    const updatedAt = new Date().toISOString();
    if (!statusMap[userId]) {
      statusMap[userId] = {};
    }
    statusMap[userId][bookId] = { status, updatedAt };
    saveMockReadingStatus(statusMap);
    return Promise.resolve({ status, updatedAt });
  }
  return Promise.resolve({ status, updatedAt: new Date().toISOString() });
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function selectMockRecommendations(query: string, count: number): Recommendation[] {
  const safeQuery = query.trim() || 'book recommendations';
  const queryLower = safeQuery.toLowerCase();
  const matches = mockBooks.filter((book) => {
    const haystack = `${book.title} ${book.author} ${book.genre} ${book.description}`.toLowerCase();
    return haystack.includes(queryLower);
  });
  const pool = matches.length > 0 ? matches : mockBooks;
  const offset = pool.length ? hashString(safeQuery) % pool.length : 0;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
  return rotated.slice(0, count).map((book, index) => ({
    id: `mock-rec-${offset}-${index + 1}`,
    bookId: book.id,
    reason: `Based on your request "${safeQuery}", this ${book.genre.toLowerCase()} pick should fit well.`,
    confidence: 0.92 - index * 0.08,
  }));
}

/**
 * Get authentication headers with JWT token from Cognito
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return { 'Content-Type': 'application/json' };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

/**
 * Get all books from the catalog
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-books (see IMPLEMENTATION_GUIDE.md)
 * 2. Create API Gateway endpoint: GET /books
 * 3. Uncomment API_BASE_URL at top of file
 * 4. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books`);
 * if (!response.ok) throw new Error('Failed to fetch books');
 * return response.json();
 *
 * Expected response: Array of Book objects from DynamoDB
 */
export async function getBooks(): Promise<Book[]> {
  if (USE_MOCK_API) {
    return Promise.resolve(mockBooks);
  }
  const response = await fetch(`${API_BASE_URL}/books`);
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
}

/**
 * Get a single book by ID
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-book (see IMPLEMENTATION_GUIDE.md)
 * 2. Create API Gateway endpoint: GET /books/{id}
 * 3. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books/${id}`);
 * if (response.status === 404) return null;
 * if (!response.ok) throw new Error('Failed to fetch book');
 * return response.json();
 *
 * Expected response: Single Book object or null if not found
 */
export async function getBook(id: string): Promise<Book | null> {
  if (USE_MOCK_API) {
    return Promise.resolve(mockBooks.find((book) => book.id === id) || null);
  }
  const response = await fetch(`${API_BASE_URL}/books/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch book');
  return response.json();
}

/**
 * Create a new book (admin only)
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-create-book
 * 2. Create API Gateway endpoint: POST /books
 * 3. Add Cognito authorizer (Week 3)
 * 4. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/books`, {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify(book)
 * });
 * if (!response.ok) throw new Error('Failed to create book');
 * return response.json();
 *
 * Note: This endpoint requires admin role in Cognito
 */
export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  // TODO: Remove this mock implementation after deploying Lambda
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBook: Book = {
        ...book,
        id: Date.now().toString(),
      };
      resolve(newBook);
    }, 500);
  });
}

/**
 * Update an existing book (admin only)
 * TODO: Replace with PUT /books/:id API call
 */
export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingBook = mockBooks.find((b) => b.id === id);
      const updatedBook: Book = {
        ...existingBook!,
        ...book,
        id,
      };
      resolve(updatedBook);
    }, 500);
  });
}

/**
 * Delete a book (admin only)
 * TODO: Replace with DELETE /books/:id API call
 */
export async function deleteBook(): Promise<void> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
}

/**
 * Get AI-powered book recommendations using Amazon Bedrock
 *
 * TODO: Replace with real API call in Week 4, Day 1-2
 *
 * Implementation steps:
 * 1. Enable Bedrock model access in AWS Console (Claude 3 Haiku recommended)
 * 2. Deploy Lambda function: library-get-recommendations (see IMPLEMENTATION_GUIDE.md)
 * 3. Create API Gateway endpoint: POST /recommendations
 * 4. Add Cognito authorizer
 * 5. Update function signature to accept query parameter:
 *    export async function getRecommendations(query: string): Promise<Recommendation[]>
 * 6. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/recommendations`, {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify({ query })
 * });
 * if (!response.ok) throw new Error('Failed to get recommendations');
 * const data = await response.json();
 * return data.recommendations;
 *
 * Expected response: Array of recommendations with title, author, reason, confidence
 *
 * Documentation: https://docs.aws.amazon.com/bedrock/latest/userguide/
 */
export async function getRecommendations(query: string = 'Recommend me some good books'): Promise<Recommendation[]> {
  if (USE_MOCK_API) {
    return selectMockRecommendations(query, 3);
  }
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query })
  });
  if (!response.ok) throw new Error('Failed to get recommendations');
  const data = await response.json();
  return data.recommendations;
}

/**
 * Get user's reading lists
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-reading-lists
 * 2. Lambda should query DynamoDB by userId (from Cognito token)
 * 3. Create API Gateway endpoint: GET /reading-lists
 * 4. Add Cognito authorizer (Week 3)
 * 5. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/reading-lists`, {
 *   headers
 * });
 * if (!response.ok) throw new Error('Failed to fetch reading lists');
 * return response.json();
 *
 * Expected response: Array of ReadingList objects for the authenticated user
 */
export async function getReadingLists(userId: string = '1'): Promise<ReadingList[]> {
  if (USE_MOCK_API) {
    const lists = loadMockReadingLists();
    return Promise.resolve(lists.filter((list) => list.userId === userId));
  }
  const response = await fetch(`${API_BASE_URL}/reading-lists?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch reading lists');
  return response.json();
}

export async function getAllReadingLists(): Promise<ReadingList[]> {
  if (USE_MOCK_API) {
    return Promise.resolve(loadMockReadingLists());
  }
  return Promise.resolve([]);
}

/**
 * Create a new reading list
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-create-reading-list
 * 2. Lambda should generate UUID for id and timestamps
 * 3. Lambda should get userId from Cognito token
 * 4. Create API Gateway endpoint: POST /reading-lists
 * 5. Add Cognito authorizer (Week 3)
 * 6. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/reading-lists`, {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify(list)
 * });
 * if (!response.ok) throw new Error('Failed to create reading list');
 * return response.json();
 *
 * Expected response: Complete ReadingList object with generated id and timestamps
 */
export async function createReadingList(
  list: Omit<ReadingList, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReadingList> {
  if (USE_MOCK_API) {
    const now = new Date().toISOString();
    const newList: ReadingList = {
      ...list,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    const lists = loadMockReadingLists();
    const updatedLists = [...lists, newList];
    saveMockReadingLists(updatedLists);
    return Promise.resolve(newList);
  }
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/reading-lists`, {
    method: 'POST',
    headers,
    body: JSON.stringify(list)
  });
  if (!response.ok) throw new Error('Failed to create reading list');
  return response.json();
}

/**
 * Update a reading list
 */
export async function updateReadingList(
  id: string,
  list: Partial<ReadingList>
): Promise<ReadingList> {
  if (USE_MOCK_API) {
    const lists = loadMockReadingLists();
    const updatedLists = lists.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        ...list,
        updatedAt: new Date().toISOString(),
      };
    });
    saveMockReadingLists(updatedLists);
    const updatedList = updatedLists.find((item) => item.id === id);
    if (!updatedList) throw new Error('Reading list not found');
    return Promise.resolve(updatedList);
  }
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(list)
  });
  if (!response.ok) throw new Error('Failed to update reading list');
  return response.json();
}

/**
 * Delete a reading list
 */
export async function deleteReadingList(id: string, userId: string): Promise<void> {
  if (USE_MOCK_API) {
    const lists = loadMockReadingLists();
    const updatedLists = lists.filter((list) => !(list.id === id && list.userId === userId));
    saveMockReadingLists(updatedLists);
    return Promise.resolve();
  }
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ userId })
  });
  if (!response.ok) throw new Error('Failed to delete reading list');
}

/**
 * Get reviews for a book
 * TODO: Replace with GET /books/:id/reviews API call
 */
export async function getReviews(bookId: string): Promise<Review[]> {
  if (USE_MOCK_API) {
    const reviews = loadMockReviews()
      .filter((review) => review.bookId === bookId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return Promise.resolve(reviews);
  }
  // TODO: Replace with GET /books/:id/reviews API call
  return Promise.resolve([]);
}

export async function getAllReviews(): Promise<Review[]> {
  if (USE_MOCK_API) {
    return Promise.resolve(loadMockReviews());
  }
  return Promise.resolve([]);
}

/**
 * Create a new review
 * TODO: Replace with POST /books/:bookId/reviews API call
 */
export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  if (USE_MOCK_API) {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    const reviews = loadMockReviews();
    saveMockReviews([newReview, ...reviews]);
    return Promise.resolve(newReview);
  }
  // TODO: Replace with POST /books/:bookId/reviews API call
  return Promise.resolve({
    ...review,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  });
}

export async function likeReview(reviewId: string): Promise<Review | null> {
  if (USE_MOCK_API) {
    const reviews = loadMockReviews();
    const updated = reviews.map((review) => {
      if (review.id !== reviewId) return review;
      return {
        ...review,
        likes: (review.likes || 0) + 1,
      };
    });
    saveMockReviews(updated);
    const found = updated.find((review) => review.id === reviewId) || null;
    return Promise.resolve(found);
  }
  return Promise.resolve(null);
}

export async function replyToReview(
  reviewId: string,
  reply: { userId: string; comment: string }
): Promise<Review | null> {
  if (USE_MOCK_API) {
    const reviews = loadMockReviews();
    const updated = reviews.map((review) => {
      if (review.id !== reviewId) return review;
      const nextReplies = [
        ...(review.replies || []),
        {
          id: Date.now().toString(),
          userId: reply.userId,
          comment: reply.comment,
          createdAt: new Date().toISOString(),
        },
      ];
      return {
        ...review,
        replies: nextReplies,
      };
    });
    saveMockReviews(updated);
    const found = updated.find((review) => review.id === reviewId) || null;
    return Promise.resolve(found);
  }
  return Promise.resolve(null);
}

export async function deleteReview(reviewId: string): Promise<void> {
  if (USE_MOCK_API) {
    const reviews = loadMockReviews();
    const updated = reviews.filter((review) => review.id !== reviewId);
    saveMockReviews(updated);
    return Promise.resolve();
  }
  return Promise.resolve();
}
