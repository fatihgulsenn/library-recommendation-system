import { Book, User, ReadingList } from '@/types';

/**
 * ============================================================================
 * MOCK DATA FOR DEVELOPMENT
 * ============================================================================
 *
 * ⚠️ IMPORTANT FOR AI ASSISTANTS AND DEVELOPERS:
 * This file contains ALL mock data used in the application during development.
 * When implementing the AWS backend, you should:
 *
 * 1. REMOVE all mock data from this file
 * 2. UPDATE src/services/api.ts to call real AWS Lambda functions
 * 3. LOAD this data into DynamoDB tables for initial testing
 * 4. DELETE this file once backend integration is complete
 *
 * ============================================================================
 * MOCK DATA LOCATIONS IN THE APPLICATION:
 * ============================================================================
 *
 * This mock data is currently used in:
 * - src/services/api.ts (all API functions return mock data)
 * - src/pages/Books.tsx (displays mockBooks)
 * - src/pages/BookDetail.tsx (finds book from mockBooks)
 * - src/pages/ReadingLists.tsx (displays mockReadingLists)
 * - src/pages/Admin.tsx (uses mockBooks for admin operations)
 *
 * ============================================================================
 * HOW TO REPLACE MOCK DATA WITH REAL API:
 * ============================================================================
 *
 * Step 1: Deploy DynamoDB tables using CDK (see infrastructure/lib/database-stack.ts)
 * Step 2: Load this data into DynamoDB using AWS CLI or Lambda function
 * Step 3: Deploy Lambda functions (see infrastructure/lambda/)
 * Step 4: Update src/services/api.ts to call Lambda via API Gateway
 * Step 5: Remove mock data returns from api.ts functions
 * Step 6: Test each endpoint individually
 * Step 7: Delete this file
 *
 * ============================================================================
 * DATA STRUCTURE NOTES:
 * ============================================================================
 *
 * - Book IDs: Simple numeric strings ('1', '2', etc.) - replace with UUIDs in production
 * - Dates: ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
 * - Ratings: Float between 0.0 and 5.0
 * - Cover Images: Relative paths to /public/book-covers/ directory
 * - ISBNs: ISBN-13 format (978-XXXXXXXXXX)
 *
 * ============================================================================
 */

/**
 * MOCK BOOKS DATA
 *
 * This array contains 10 sample books across different genres.
 *
 * TO LOAD INTO DYNAMODB:
 * Use the AWS CLI or create a Lambda function to batch write these items:
 *
 * ```bash
 * aws dynamodb batch-write-item --request-items file://books-data.json
 * ```
 *
 * TO REPLACE IN CODE:
 * Update src/services/api.ts getBooks() function to call:
 * GET /books endpoint (Lambda function: get-books)
 */
export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    description:
      'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0525559474-L.jpg',
    rating: 4.5,
    publishedYear: 2020,
    isbn: '978-0525559474',
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    description:
      'A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the author of The Martian.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0593135204-L.jpg',
    rating: 4.8,
    publishedYear: 2021,
    isbn: '978-0593135204',
  },
  {
    id: '3',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Mystery',
    description:
      "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house. One evening her husband returns home late, and Alicia shoots him five times in the face, and then never speaks another word.",
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-1250301697-L.jpg',
    rating: 4.3,
    publishedYear: 2019,
    isbn: '978-1250301697',
  },
  {
    id: '4',
    title: 'People We Meet on Vacation',
    author: 'Emily Henry',
    genre: 'Romance',
    description: 'Two best friends. Ten summer trips. One last chance to fall in love.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-1984806758-L.jpg',
    rating: 4.2,
    publishedYear: 2021,
    isbn: '978-1984806758',
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Non-Fiction',
    description:
      'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny changes, remarkable results.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0735211292-L.jpg',
    rating: 4.7,
    publishedYear: 2018,
    isbn: '978-0735211292',
  },
  {
    id: '6',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    genre: 'Fiction',
    description:
      'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-1501161933-L.jpg',
    rating: 4.6,
    publishedYear: 2017,
    isbn: '978-1501161933',
  },
  {
    id: '7',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    description:
      'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0441172719-L.jpg',
    rating: 4.4,
    publishedYear: 1965,
    isbn: '978-0441172719',
  },
  {
    id: '8',
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    genre: 'Mystery',
    description:
      'Four unlikely friends meet weekly to investigate unsolved killings. But when a local developer is found dead, these unorthodox detectives find themselves in the middle of their first live case.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-1984880987-L.jpg',
    rating: 4.1,
    publishedYear: 2020,
    isbn: '978-1984880987',
  },
  {
    id: '9',
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Non-Fiction',
    description:
      'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0399590504-L.jpg',
    rating: 4.5,
    publishedYear: 2018,
    isbn: '978-0399590504',
  },
  {
    id: '10',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    genre: 'Fiction',
    description:
      "A tale of gods, kings, immortal fame and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer's enduring masterwork, The Iliad.",
    coverImage: 'https://covers.openlibrary.org/b/isbn/978-0062060624-L.jpg',
    rating: 4.6,
    publishedYear: 2011,
    isbn: '978-0062060624',
  },
  {
    id: '11',
    title: '1984',
    author: 'George Orwell',
    genre: 'Classic',
    description: 'A dystopian novel about surveillance, truth, and freedom in a totalitarian state.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    rating: 4.7,
    publishedYear: 1949,
    isbn: '9780451524935',
  },
  {
    id: '12',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic',
    description: 'A coming-of-age story that confronts racism and injustice in the American South.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
    rating: 4.8,
    publishedYear: 1960,
    isbn: '9780061120084',
  },
  {
    id: '13',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    description: 'A portrait of ambition and disillusionment in the Jazz Age.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
    rating: 4.3,
    publishedYear: 1925,
    isbn: '9780743273565',
  },
  {
    id: '14',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'Bilbo Baggins joins a quest to reclaim a lost kingdom and its treasure.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
    rating: 4.8,
    publishedYear: 1937,
    isbn: '9780547928227',
  },
  {
    id: '15',
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description: 'A young wizard begins his journey at Hogwarts School of Witchcraft and Wizardry.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg',
    rating: 4.9,
    publishedYear: 1997,
    isbn: '9780590353427',
  },
  {
    id: '16',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genre: 'Fantasy',
    description: 'The legendary story of Kvothe, a gifted musician and magician.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg',
    rating: 4.6,
    publishedYear: 2007,
    isbn: '9780756404741',
  },
  {
    id: '17',
    title: 'The Martian',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    description: 'An astronaut stranded on Mars must survive using science and ingenuity.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780804139021-L.jpg',
    rating: 4.7,
    publishedYear: 2014,
    isbn: '9780804139021',
  },
  {
    id: '18',
    title: 'Ready Player One',
    author: 'Ernest Cline',
    genre: 'Science Fiction',
    description: 'A virtual-reality treasure hunt in a dystopian future.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307887443-L.jpg',
    rating: 4.2,
    publishedYear: 2011,
    isbn: '9780307887443',
  },
  {
    id: '19',
    title: 'Foundation',
    author: 'Isaac Asimov',
    genre: 'Science Fiction',
    description: 'A mathematician predicts the fall of a galactic empire and builds a plan to save knowledge.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg',
    rating: 4.5,
    publishedYear: 1951,
    isbn: '9780553293357',
  },
  {
    id: '20',
    title: 'Neuromancer',
    author: 'William Gibson',
    genre: 'Science Fiction',
    description: 'A cyberpunk classic about hackers, AI, and corporate intrigue.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780441569595-L.jpg',
    rating: 4.1,
    publishedYear: 1984,
    isbn: '9780441569595',
  },
  {
    id: '21',
    title: "Ender's Game",
    author: 'Orson Scott Card',
    genre: 'Science Fiction',
    description: 'A child military genius is trained through war games to defend Earth.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780812550702-L.jpg',
    rating: 4.6,
    publishedYear: 1985,
    isbn: '9780812550702',
  },
  {
    id: '22',
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Thriller',
    description: 'A dark psychological thriller about a missing wife and a fractured marriage.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg',
    rating: 4.1,
    publishedYear: 2012,
    isbn: '9780307588371',
  },
  {
    id: '23',
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    genre: 'Mystery',
    description: 'A journalist and a hacker investigate a decades-old disappearance.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307454546-L.jpg',
    rating: 4.2,
    publishedYear: 2005,
    isbn: '9780307454546',
  },
  {
    id: '24',
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Mystery',
    description: 'A symbologist uncovers a secret that could shake the foundations of history.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
    rating: 4.0,
    publishedYear: 2003,
    isbn: '9780307474278',
  },
  {
    id: '25',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    description: "A shepherd travels in search of treasure and discovers his personal legend.",
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',
    rating: 4.3,
    publishedYear: 1988,
    isbn: '9780061122415',
  },
  {
    id: '26',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    description: 'A sweeping history of humankind from the Stone Age to the modern era.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    rating: 4.7,
    publishedYear: 2011,
    isbn: '9780062316097',
  },
  {
    id: '27',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genre: 'Non-Fiction',
    description: 'An exploration of how we think, make decisions, and fall into biases.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
    rating: 4.5,
    publishedYear: 2011,
    isbn: '9780374533557',
  },
  {
    id: '28',
    title: 'The Power of Habit',
    author: 'Charles Duhigg',
    genre: 'Non-Fiction',
    description: 'Why habits exist and how they can be changed.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780812981605-L.jpg',
    rating: 4.3,
    publishedYear: 2012,
    isbn: '9780812981605',
  },
  {
    id: '29',
    title: 'Deep Work',
    author: 'Cal Newport',
    genre: 'Non-Fiction',
    description: 'Rules for focused success in a distracted world.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
    rating: 4.4,
    publishedYear: 2016,
    isbn: '9781455586691',
  },
  {
    id: '30',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Technology',
    description: 'A handbook of agile software craftsmanship and clean coding practices.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    rating: 4.7,
    publishedYear: 2008,
    isbn: '9780132350884',
  },
  {
    id: '31',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt and David Thomas',
    genre: 'Technology',
    description: 'Practical advice for building better software and improving workflow.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg',
    rating: 4.6,
    publishedYear: 1999,
    isbn: '9780201616224',
  },
  {
    id: '32',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'A classic romance of manners, wit, and social expectations.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    rating: 4.6,
    publishedYear: 1813,
    isbn: '9780141439518',
  },
  {
    id: '33',
    title: 'Little Women',
    author: 'Louisa May Alcott',
    genre: 'Classic',
    description: 'Four sisters navigate family, friendship, and growing up during the Civil War.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780147514011-L.jpg',
    rating: 4.5,
    publishedYear: 1868,
    isbn: '9780147514011',
  },
  {
    id: '34',
    title: 'The Road',
    author: 'Cormac McCarthy',
    genre: 'Fiction',
    description: 'A father and son journey through a bleak post-apocalyptic landscape.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307387899-L.jpg',
    rating: 4.2,
    publishedYear: 2006,
    isbn: '9780307387899',
  },
  {
    id: '35',
    title: 'The Handmaid\'s Tale',
    author: 'Margaret Atwood',
    genre: 'Fiction',
    description: 'A chilling dystopia about power, identity, and resistance.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg',
    rating: 4.4,
    publishedYear: 1985,
    isbn: '9780385490818',
  },
  {
    id: '36',
    title: 'The Ottoman Empire',
    author: 'Donald Quataert',
    genre: 'History',
    description: 'A concise overview of Ottoman (Osmanli) history, institutions, and society.',
    coverImage: '/book-covers/ottoman-empire.jpg',
    rating: 4.4,
    publishedYear: 2005,
    isbn: '9780521549592',
  },
  {
    id: '37',
    title: 'Osmanli: The Ottoman Centuries',
    author: 'Lord Kinross',
    genre: 'History',
    description: 'A narrative history of the Ottoman (Osmanli) Empire and its rulers.',
    coverImage: '/book-covers/osmanli-centuries.jpg',
    rating: 4.3,
    publishedYear: 1977,
    isbn: '9780688080938',
  },
  {
    id: '38',
    title: 'Osman\'s Dream',
    author: 'Caroline Finkel',
    genre: 'History',
    description: 'A sweeping history of the Ottoman (Osmanli) Empire from its origins to modern times.',
    coverImage: '/book-covers/osmans-dream.jpg',
    rating: 4.4,
    publishedYear: 2005,
    isbn: '9780465021012',
  },
  {
    id: '39',
    title: 'Cloud Computing',
    author: 'Nobert Young',
    genre: 'Technology',
    description: 'An introductory guide to cloud computing fundamentals and services.',
    coverImage: '/book-covers/cloud-extra-1.jpg',
    rating: 4.1,
    publishedYear: 2019,
    isbn: '9780000000001',
  },
  {
    id: '40',
    title: 'Cloud Native Patterns',
    author: 'Cornelia Davis',
    genre: 'Technology',
    description: 'Designing change-tolerant software for cloud-native environments.',
    coverImage: '/book-covers/cloud-native-patterns.jpg',
    rating: 4.3,
    publishedYear: 2019,
    isbn: '9781617294297',
  },
  {
    id: '41',
    title: 'Architecting the Cloud',
    author: 'Michael J. Kavis',
    genre: 'Technology',
    description: 'Best practices for designing and building cloud solutions.',
    coverImage: '/book-covers/architecting-the-cloud.jpg',
    rating: 4.2,
    publishedYear: 2014,
    isbn: '9781118617618',
  },
  {
    id: '42',
    title: 'Cloud computing',
    author: 'Rajkumar Buyya and James Broberg',
    genre: 'Technology',
    description: 'An overview of cloud computing models, platforms, and applications.',
    coverImage: '/book-covers/cloud-extra-2.jpg',
    rating: 4.2,
    publishedYear: 2010,
    isbn: '9780000000002',
  },
];

/**
 * MOCK USERS DATA
 *
 * This array contains sample users for testing authentication and authorization.
 *
 * ⚠️ IN PRODUCTION: Users will be managed by Amazon Cognito, NOT DynamoDB
 *
 * DO NOT load this into DynamoDB. Instead:
 * 1. Set up Cognito User Pool (see infrastructure/lib/auth-stack.ts)
 * 2. Create test users via Cognito Console or AWS CLI
 * 3. User authentication will be handled by Cognito
 * 4. User profile data (name, role) can be stored in DynamoDB separately
 *
 * TO REPLACE IN CODE:
 * Update src/contexts/AuthContext.tsx to use AWS Amplify Auth:
 * - Auth.signIn() for login
 * - Auth.signUp() for registration
 * - Auth.currentAuthenticatedUser() for getting current user
 */
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'admin@library.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T10:00:00Z',
  },
];

/**
 * MOCK READING LISTS DATA
 *
 * This array contains sample reading lists for testing list management features.
 *
 * TO LOAD INTO DYNAMODB:
 * Use the AWS CLI or create a Lambda function to batch write these items:
 *
 * ```bash
 * aws dynamodb batch-write-item --request-items file://reading-lists-data.json
 * ```
 *
 * DYNAMODB TABLE STRUCTURE:
 * - Partition Key: userId (string)
 * - Sort Key: id (string)
 * - GSI: id-index (for querying by list ID)
 *
 * TO REPLACE IN CODE:
 * Update src/services/api.ts reading list functions to call:
 * - GET /reading-lists (Lambda: get-reading-lists)
 * - POST /reading-lists (Lambda: create-reading-list)
 * - PUT /reading-lists/:id (Lambda: update-reading-list)
 * - DELETE /reading-lists/:id (Lambda: delete-reading-list)
 */
export const mockReadingLists: ReadingList[] = [
  {
    id: '1',
    userId: '1',
    name: 'Summer Reading 2024',
    description: 'Books to read during summer vacation',
    bookIds: ['1', '2', '4'],
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-15T14:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    name: 'Sci-Fi Favorites',
    description: 'My favorite science fiction novels',
    bookIds: ['2', '7'],
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-05-10T10:00:00Z',
  },
];
